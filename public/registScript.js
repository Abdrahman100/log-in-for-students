const tbody = document.querySelector("tbody");
const mobileCards = document.querySelector(".mobile-cards");

// جلب الطلاب من السيرفر
async function fetchStudents() {
  try {
    const res = await fetch("http://localhost:5000/api/students");
    const students = await res.json();

    tbody.innerHTML = "";
    mobileCards.innerHTML = "";

    students.forEach(student => {

      // ====== Desktop Table ======
      const row = `

        <tr>
         <td>
<img 
src="${student.receipt}" 
class="student-img"
onclick="openImage(this.src)"
>
<br>
</td>
          <td>${student.name}</td>
          <td>${student.phone || "-"}</td>
          <td>${student.level || "-"}</td>
          <td>
            <button onclick="deleteStudent('${student._id}')" class="btn-delete">🗑️حذف</button>
          </td>
        </tr>
      `;
      tbody.innerHTML += row;

      // ====== Mobile Cards ======
      const card = `
        <div class="student-card">
                 <div class="student-card-header">
            <img src="${student.receipt}" alt="صورة ${student.name}" class="student-img" onclick="openImage(this.src)">
          </div>
          <h4>${student.name}</h4>
          <h4>${student.phone || "-"}</h4>
          <div class="student-info">
            ${student.level || "-"} 
          </div>
          <div class="actions">
            <button onclick="deleteStudent('${student._id}')" class="btn btn-delete">🗑️حذف</button>
          </div>
        </div>
      `;
      mobileCards.innerHTML += card;
    });
  } catch (err) {
    console.log("خطأ في جلب البيانات", err);
  }
}

// حذف طالب
async function deleteStudent(id) {
  if (!confirm("هل أنت متأكد من حذف الطالب؟")) return;

  await fetch(`http://localhost:5000/api/students/${id}`, {
    method: "DELETE"
  });

  fetchStudents();
}
function openImage(src) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");

  modal.style.display = "block";
  modalImg.src = src;
}
document.querySelector(".close-modal").addEventListener("click", () => {
  document.getElementById("imageModal").style.display = "none";
});
fetchStudents();