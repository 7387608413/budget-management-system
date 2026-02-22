const db = require("../database/db");

exports.register = (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password)
    return res.status(400).json({ message: "All fields required" });

  const sql = "INSERT INTO users (name,email,phone,password) VALUES (?,?,?,?)";

  db.query(sql, [name, email, phone, password], (err, result) => {
    if (err) return res.status(500).json({ message: "Registration failed" });

    res.json({
      userId: result.insertId,
      name: name
    });
  });
};

exports.login = (req, res) => {
  const { loginId, password } = req.body;

  const sql =
    "SELECT id,name FROM users WHERE (email=? OR phone=?) AND password=?";

  db.query(sql, [loginId, loginId, password], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (result.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      userId: result[0].id,
      name: result[0].name
    });
  });
};
