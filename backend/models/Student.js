const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    receipt: {
        type: String,
        required: true
    },
    receipt_id: {
        type: String,
        required: true
    }
})
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;