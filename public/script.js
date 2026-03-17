// ==========================
// 1️⃣ Scroll Animation
// يجعل العناصر التي تحتوي على الكلاس "reveal" تظهر تدريجياً عند التمرير
// ==========================
const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      el.classList.add("active");
    }
  });
});

// ==========================
// 2️⃣ File Upload Handler
// تغيير شكل الصندوق وإظهار علامة ✅ عند رفع الصورة
// ==========================
const fileInput = document.getElementById('file-upload');
const dropZone = fileInput.closest('.drop-zone');

fileInput.addEventListener('change', () => {
  dropZone.classList.toggle('uploaded', fileInput.files.length > 0);
});

// ==========================
// 3️⃣ Form Validation & Submission
// ==========================
const form = document.getElementById("form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const btn = document.querySelector(".submit-btn");
  const span = btn.querySelector("span");

  let valid = true;

  // عناصر الحقول
  const successful = document.getElementById("successful");
  const register = document.getElementById("register");
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const phone = document.getElementById("phone");
  const level = document.getElementById("level");

  // عناصر رسائل الأخطاء
  const firstNameError = document.getElementById("firstNameError");
  const lastNameError = document.getElementById("lastNameError");
  const phoneError = document.getElementById("phoneError");
  let receiptError = document.getElementById("receiptError");

  // ==========================
  // 4️⃣ Receipt Validation
  // ==========================
  if (fileInput.files.length === 0) {
    if (!receiptError) {
      receiptError = document.createElement("small");
      receiptError.id = "receiptError";
      receiptError.className = "error active";
      receiptError.textContent = "يجب رفع صورة الصك";
      fileInput.parentElement.appendChild(receiptError);
    } else {
      receiptError.textContent = "يجب رفع صورة الصك";
      receiptError.classList.add("active");
    }
    valid = false;
  } else if (receiptError) {
    receiptError.classList.remove("active");
  }

  // ==========================
  // 5️⃣ Field Validation
  // ==========================
  if (firstName.value.trim() === "") {
    firstNameError.textContent = "الاسم الأول مطلوب";
    firstNameError.classList.add("active");
    valid = false;
  } else {
    firstNameError.classList.remove("active");
  }

  if (lastName.value.trim() === "") {
    lastNameError.textContent = "اسم العائلة مطلوب";
    lastNameError.classList.add("active");
    valid = false;
  } else {
    lastNameError.classList.remove("active");
  }

  if (phone.value.trim() === "") {
    phoneError.textContent = "رقم الهاتف مطلوب";
    phoneError.classList.add("active");
    valid = false;
  } else if (!/^\d{10}$/.test(phone.value.trim())) {
    phoneError.textContent = "رقم الهاتف غير صالح";
    phoneError.classList.add("active");
    valid = false;
  } else {
    phoneError.classList.remove("active");
  }

  // ==========================
  // 6️⃣ If All Valid - Prepare FormData
  // ==========================
  if (valid) {
    btn.disabled = true;
    span.textContent = "جاري التسجيل...";
    btn.classList.add("disabled");

    const formData = new FormData();
    formData.append("name", firstName.value + " " + lastName.value);
    formData.append("phone", phone.value);
    formData.append("level", level.value);
    formData.append("receipt", fileInput.files[0]);

    // ==========================
    // 7️⃣ Send Data to Server
    // ==========================
    const API_URL = window.location.origin + "https://log-in-for-students-production.up.railway.app/api/registrations";

    fetch(API_URL, {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);

        successful.classList.add("active");
        register.classList.remove("active");
        form.reset();
        dropZone.classList.remove("uploaded");

        btn.disabled = false;
        span.textContent = "التسجيل في الدورة";
        btn.classList.remove("disabled");

        // عرض رسالة النجاح لمدة 3 ثواني
        setTimeout(() => {
          successful.classList.remove("active");
          register.classList.add("active");
        }, 3000);
      })
      .catch(err => {
        console.error(err);
        alert("حدث خطأ أثناء التسجيل");

        btn.disabled = false;
        span.textContent = "التسجيل في الدورة";
        btn.classList.remove("disabled");
      });
  }
});