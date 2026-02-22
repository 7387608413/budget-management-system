const db = require("../database/db");

exports.addExpense = (req, res) => {
  const { user_id, amount, category } = req.body;

  const sql =
    "INSERT INTO expenses (user_id,amount,category,expense_date,expense_time) VALUES (?,?,?,CURDATE(),CURTIME())";

  db.query(sql, [user_id, amount, category], () => {
    res.json({ message: "Expense added" });
  });
};

exports.getExpenses = (req, res) => {
  const user_id = req.query.user_id;

  db.query(
    "SELECT * FROM expenses WHERE user_id=? ORDER BY id DESC",
    [user_id],
    (err, rows) => {
      res.json(rows);
    }
  );
};
