const express = require("express");
const router = express.Router();
const db = require("../database/db");

/* REGISTER */
router.post("/register", (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const sql = "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, email, phone, password], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Registration failed" });
    }

    res.json({ message: "Registered successfully" });
  });
});

/* LOGIN */
router.post("/login", (req, res) => {
  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const sql =
    "SELECT * FROM users WHERE (email=? OR phone=?) AND password=?";

  db.query(sql, [loginId, loginId, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      userId: result[0].id,
      name: result[0].name
    });
  });
});

module.exports = router;