const express = require("express");
const router = express.Router();

const db = require("../database/db");
const sendEmail = require("../utils/emailServices");

/* ================= ADD EXPENSE ================= */

router.post("/", (req, res) => {

  const { user_id, amount, category } = req.body;

  const amt = Number(amount);

  const insertSql =
  "INSERT INTO expenses (user_id,amount,category,expense_date,expense_time) VALUES (?,?,?,CURDATE(),CURTIME())";

  db.query(insertSql, [user_id, amt, category], (err) => {

    if (err) {
      console.log("Expense error:", err);
      return res.status(500).json({ message: "Expense failed" });
    }

    /* ================= CHECK BUDGET ================= */

    const summarySql = `
      SELECT 
      (SELECT IFNULL(SUM(amount),0) FROM expenses WHERE user_id=?) AS spent,
      (SELECT IFNULL(monthly_budget,0) FROM budget WHERE user_id=?) AS budget
    `;

    db.query(summarySql, [user_id, user_id], (err, result) => {

      if (err) return res.json({ message: "Expense added" });

      const spent = result[0].spent;
      const budget = result[0].budget;

      let percent = 0;

      if (budget > 0) {
        percent = (spent / budget) * 100;
      }

      /* ================= GET USER EMAIL ================= */

      const userSql = "SELECT email,name FROM users WHERE id=?";

      db.query(userSql, [user_id], (err, user) => {

        if (err || user.length === 0)
          return res.json({ message: "Expense added" });

        const email = user[0].email;
        const name = user[0].name;

        /* ================= EMAIL ALERTS ================= */

        if (percent >= 75 && percent < 100) {

          sendEmail(
            email,
            "Budget Warning",
            `Hello ${name},

You have used ${Math.round(percent)}% of your monthly budget.

Please control your spending.`
          );

        }

        if (percent >= 100) {

          sendEmail(
            email,
            "Budget Exceeded",
            `Hello ${name},

Your monthly budget has been exceeded.

Please review your expenses.`
          );

        }

        if (amt >= 1000) {

          sendEmail(
            email,
            "Large Expense Alert",
            `Hello ${name},

A large expense of ₹${amt} was added to your account.`
          );

        }

        res.json({ message: "Expense added successfully" });

      });

    });

  });

});

/* ================= GET EXPENSE HISTORY ================= */

router.get("/", (req, res) => {

  const user_id = req.query.user_id;

  const sql = `
  SELECT *
  FROM expenses
  WHERE user_id=?
  ORDER BY expense_date DESC, expense_time DESC
  `;

  db.query(sql, [user_id], (err, result) => {

    if (err) {
      console.log("History error:", err);
      return res.status(500).json({ message: "Error loading expenses" });
    }

    res.json(result);

  });

});

module.exports = router;