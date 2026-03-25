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
  if (fileInput.files.length > 0) {
    dropZone.classList.add('uploaded'); // إضافة الكلاس لتغيير الشكل والرمز
  } else {
    dropZone.classList.remove('uploaded'); // العودة للوضع الأصلي إذا أزال المستخدم الملف
  }
});

// ==========================
// 3️⃣ Form Validation
// التحقق من صحة الفورم قبل الإرسال
// ==========================
const form = document.getElementById("form");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const btn = document.querySelector(".submit-btn");
  const span = btn.querySelector("span");
  let valid = true;
  const successful = document.getElementById("successful");
  const register = document.getElementById("register");
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const phone = document.getElementById("phone");
  const level = document.getElementById("level");

  const firstNameError = document.getElementById("firstNameError");
  const lastNameError = document.getElementById("lastNameError");
  const phoneError = document.getElementById("phoneError");

  // ==========================
  // 4️⃣ Receipt Error Handling
  // التحقق من رفع الصورة وإظهار رسالة الخطأ إذا لم يرفع المستخدم صورة
  // ==========================
  const receiptError = document.getElementById("receiptError"); // إنشاء عنصر الخطأ في HTML

  if (fileInput.files.length === 0) {
    if (!receiptError) {
      const errorElem = document.createElement("small");
      errorElem.id = "receiptError";
      errorElem.className = "error active";
      errorElem.textContent = "يجب رفع صورة الصك";
      fileInput.parentElement.appendChild(errorElem);
    } else {
      receiptError.textContent = "يجب رفع صورة الصك";
      receiptError.classList.add("active");
    }
    valid = false; // تمنع الإرسال
  } else {
    if (receiptError) {
      receiptError.classList.remove("active");
    }
  }

  // ==========================
  // 5️⃣ Field Validation
  // التحقق من باقي الحقول: الاسم الأول، اسم العائلة، ورقم الهاتف
  // ==========================
  if (firstName.value.trim() === "") {
    firstNameError.textContent = "الاسم الأول مطلوب";
    firstNameError.classList.add("active");
    valid = false;
  }

  if (lastName.value.trim() === "") {
    lastNameError.textContent = "اسم العائلة مطلوب";
    lastNameError.classList.add("active");
    valid = false;
  }

  if (phone.value.trim() === "") {
    phoneError.textContent = "رقم الهاتف مطلوب";
    phoneError.classList.add("active");
    valid = false;
  }
  if (phone.value.trim() !== "" && !/^\d{10}$/.test(phone.value.trim())) {
    phoneError.textContent = "رقم الهاتف غير صالح";
    phoneError.classList.add("active");
    valid = false;
  }

  // ==========================
  // 6️⃣ If All Valid - Prepare FormData
  // تجهيز البيانات للإرسال إذا كل شيء صحيح
  // ==========================
  if (valid) {

    firstNameError.classList.remove("active");
    lastNameError.classList.remove("active");
    phoneError.classList.remove("active");

    btn.disabled = true;
    span.textContent = "جاري التسجيل...";
    btn.classList.add("disabled");

    const fileInput = document.getElementById("file-upload")

    const formData = new FormData()

    formData.append("name", firstName.value + " " + lastName.value)
    formData.append("phone", phone.value)
    formData.append("level", level.value)
    formData.append("receipt", fileInput.files[0])

    // ==========================
    // 7️⃣ Send Data to Server
    // إرسال البيانات إلى السيرفر وعرض رسالة النجاح أو الخطأ
    // ==========================
    fetch("/register", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)

        successful.classList.add("active")
        register.classList.remove("active")

        form.reset()

        btn.disabled = false
        span.textContent = " التسجيل في الدورة"
        btn.classList.remove("disabled")
        successful.classList.remove("active")
        register.classList.add("active")
      })
      .catch(err => {
        console.error(err)
        alert("حدث خطأ أثناء التسجيل")

        btn.disabled = false
        span.textContent = " التسجيل في الدورة"
        btn.classList.remove("disabled")
      })
  }
});
