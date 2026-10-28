
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// GET request
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// POST request and server-side validation
app.post("/register", (req, res) => {
  const { name, email, age, password } = req.body;
  const errors = [];

  if (
    typeof name !== "string" ||
    !/^[A-Za-z][A-Za-z .'-]{1,49}$/.test(name.trim())
  ) {
    errors.push("Name must contain 2-50 valid characters.");
  }

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    errors.push("Enter a valid email address.");
  }

  const studentAge = Number(age);

  if (
    typeof age !== "string" ||
    age.trim() === "" ||
    !Number.isInteger(studentAge) ||
    studentAge < 17 ||
    studentAge > 30
  ) {
    errors.push("Age must be between 17 and 30.");
  }

  if (
    typeof password !== "string" ||
    password.length < 8
  ) {
    errors.push("Password must have at least 8 characters.");
  }

  if (errors.length > 0) {
    return res.status(400).send(`
      <h2 style="color:red">Registration Failed</h2>
      <ul>${errors.map(e => `<li>${e}</li>`).join("")}</ul>
      <a href="/">Try Again</a>
    `);
  }

  res.send(`
    <h2 style="color:green">Registration Successful!</h2>
    <p>Student details passed server-side validation.</p>
    <p>Name: ${name.trim().replace(/[&<>"']/g, "")}</p>
    <p>Email: ${email.trim().replace(/[&<>"']/g, "")}</p>
    <p>Age: ${studentAge}</p>
    <a href="/">Register Another Student</a>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
