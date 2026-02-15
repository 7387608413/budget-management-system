const db = require("../../database/db");

exports.register = (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const sql =
    "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, email, phone, password], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "User already exists" });
      }
      return res.status(500).json({ message: "Database error" });
    }

    res.json({ message: "Registration successful" });
  });
};

exports.login = (req, res) => {
  const { loginId, password } = req.body;

  const sql =
    "SELECT * FROM users WHERE (email = ? OR phone = ?) AND password = ?";

  db.query(sql, [loginId, loginId, password], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: result[0],
    });
  });
};
