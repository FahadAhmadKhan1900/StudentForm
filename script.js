const SUPABASE_URL = "https://ycwrxyruwqemivhhuslt.supabase.co";
const SUPABASE_KEY = "sb_publishable_IGeDP5EZR1BGmUb0sOT_Ig_Xdcp8Klj";

const form = document.getElementById("studentForm");
const message = document.getElementById("message");
const studentsList = document.getElementById("studentsList");
const loadBtn = document.getElementById("loadBtn");
const searchBtn = document.getElementById("searchBtn");
const showAllBtn = document.getElementById("showAllBtn");
const searchInput = document.getElementById("searchInput");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const yearLevel = document.getElementById("yearLevel").value;

  if (!fullName || !email || !yearLevel) {
    message.textContent = "Please fill in all fields.";
    message.style.color = "red";
    return;
  }

  const studentData = {
    full_name: fullName,
    email: email,
    year_level: yearLevel
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Prefer": "return=representation"
      },
      body: JSON.stringify(studentData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    message.textContent = "Student saved successfully.";
    message.style.color = "green";
    form.reset();

    loadStudents();
  } catch (error) {
    console.error("Save error:", error);
    message.textContent = "Error saving student.";
    message.style.color = "red";
  }
});

loadBtn.addEventListener("click", function () {
  loadStudents();
});

searchBtn.addEventListener("click", function () {
  searchStudents();
});

showAllBtn.addEventListener("click", function () {
  searchInput.value = "";
  loadStudents();
});

async function loadStudents() {
  studentsList.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/students?select=*&order=id.desc`,
      {
        method: "GET",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const students = await response.json();
    displayStudents(students);
  } catch (error) {
    console.error("Load error:", error);
    studentsList.innerHTML = "<p>Error loading records.</p>";
  }
}

async function searchStudents() {
  const searchValue = searchInput.value.trim();

  if (searchValue === "") {
    studentsList.innerHTML = "<p>Please enter a student name or ID.</p>";
    return;
  }

  studentsList.innerHTML = "<p>Searching...</p>";

  try {
    let url = "";

    if (!isNaN(searchValue)) {
      url = `${SUPABASE_URL}/rest/v1/students?select=*&id=eq.${searchValue}`;
    } else {
      url = `${SUPABASE_URL}/rest/v1/students?select=*&full_name=ilike.*${encodeURIComponent(searchValue)}*`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const students = await response.json();
    displayStudents(students);
  } catch (error) {
    console.error("Search error:", error);
    studentsList.innerHTML = "<p>Error searching records.</p>";
  }
}

function displayStudents(students) {
  if (students.length === 0) {
    studentsList.innerHTML = "<p>No matching records found.</p>";
    return;
  }

  studentsList.innerHTML = "";

  students.forEach(function (student) {
    const div = document.createElement("div");
    div.className = "student-card";
    div.innerHTML = `
      <strong>${student.full_name}</strong><br>
      Email: ${student.email}<br>
      Year Level: ${student.year_level}<br>
      ID: ${student.id}
    `;
    studentsList.appendChild(div);
  });
}