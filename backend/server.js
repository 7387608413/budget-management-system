require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("../database/db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API running"));

const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

/* ================= SUMMARY ================= */
app.get("/api/summary", (req, res) => {
  const user_id = req.query.user_id;
  if (!user_id) return res.status(400).json({ message: "User ID required" });

  db.query(
    "SELECT IFNULL(SUM(amount),0) AS spent FROM expenses WHERE user_id=?",
    [user_id],
    (err, spent) => {
      if (err) return res.status(500).json({ error: "DB error" });

      db.query(
        "SELECT IFNULL(monthly_budget,0) AS budget FROM budget WHERE user_id=?",
        [user_id],
        (err, budget) => {
          if (err) return res.status(500).json({ error: "DB error" });

          res.json({
            spent: spent[0].spent,
            budget: budget[0]?.budget || 0
          });
        }
      );
    }
  );
});

/* ================= UPDATE BUDGET ================= */
app.post("/api/budget", (req, res) => {
  const { user_id, amount } = req.body;

  if (!user_id || !amount) {
    return res.status(400).json({ message: "Missing data" });
  }

  const checkSql = "SELECT id FROM budget WHERE user_id=?";

  db.query(checkSql, [user_id], (err, result) => {
    if (err) return res.status(500).json({ error: "DB error" });

    if (result.length > 0) {
      db.query(
        "UPDATE budget SET monthly_budget=? WHERE user_id=?",
        [amount, user_id],
        (err) => {
          if (err) return res.status(500).json({ error: "Update failed" });
          res.json({ message: "Budget updated" });
        }
      );
    } else {
      db.query(
        "INSERT INTO budget (user_id, monthly_budget) VALUES (?,?)",
        [user_id, amount],
        (err) => {
          if (err) return res.status(500).json({ error: "Insert failed" });
          res.json({ message: "Budget created" });
        }
      );
    }
  });
});

/* ================= ADD EXPENSE ================= */
app.post("/api/expense", (req, res) => {
  const { user_id, amount, category } = req.body;

  if (!user_id || !amount || !category) {
    return res.status(400).json({ message: "Missing data" });
  }

  const sql =
    "INSERT INTO expenses (user_id, amount, category, expense_date, expense_time) VALUES (?, ?, ?, CURDATE(), CURTIME())";

  db.query(sql, [user_id, amount, category], (err) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json({ message: "Expense added" });
  });
});

/* ================= GET EXPENSES ================= */
app.get("/api/expenses", (req, res) => {
  const user_id = req.query.user_id;

  if (!user_id) {
    return res.status(400).json({ message: "User ID required" });
  }

  db.query(
    "SELECT * FROM expenses WHERE user_id=? ORDER BY id DESC",
    [user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json(rows);
    }
  );
});

const PORT = 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
