const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const cloudinary = require('./cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const app = express();
const path = require('path');
const Student = require('./models/Student');
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();

// ======================
// MongoDB Connection
// ======================

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// ======================
// Middleware
// ======================

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

// ======================
// Get Students
// ======================

app.get("/api/students", async (req, res) => {

    try {

        const students = await Student.find();

        res.json(students);

    } catch (err) {

        console.error("Fetch error:", err);

        res.status(500).json({ message: "Error fetching students" });

    }

});

// ======================
// Delete Student
// ======================

app.delete("/api/students/:id", async (req, res) => {

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // حذف الصورة من Cloudinary
        if (student.receipt_id) {
            await cloudinary.uploader.destroy(student.receipt_id);
        }

        // حذف السجل من MongoDB
        await Student.findByIdAndDelete(req.params.id);

        res.json({ message: "Student deleted successfully" });

    } catch (err) {

        console.error("Delete error:", err);

        res.status(500).json({ message: "Error deleting student" });

    }

});

// ======================
// Cloudinary Storage
// ======================

const storage = new CloudinaryStorage({

    cloudinary: cloudinary,

    params: {

        folder: 'students',

        allowed_formats: ['jpg', 'jpeg', 'png']

    }

});

const upload = multer({

    storage: storage,

    limits: { fileSize: 5 * 1024 * 1024 } // 5MB

});

// ======================
// Register Student
// ======================

app.post("/api/register", upload.single("receipt"), async (req, res) => {

    try {

        console.log("Body:", req.body);
        console.log("File:", req.file);

        if (!req.file) {

            return res.status(400).json({ message: "No file uploaded" });

        }

        const student = new Student({

            name: req.body.name,

            phone: req.body.phone,

            level: req.body.level,

            receipt: req.file.path,

            receipt_id: req.file.filename

        });

        console.log("URL to save in DB:", req.file.path)
        await student.save();

        res.json({ message: "Student saved successfully" });

    } catch (error) {

        console.error("Register error:");
        console.error(error);

        res.status(500).json({ message: "Server error" });

    }

});

// ======================
// Start Server
// ======================

app.listen(process.env.PORT || 5000, () => {
    
    console.log("Server running on http://localhost:5000");

});