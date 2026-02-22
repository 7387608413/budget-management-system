const db = require("../database/db");

exports.updateBudget = (req, res) => {
  const { user_id, amount } = req.body;

  const check = "SELECT id FROM budget WHERE user_id=?";
  db.query(check, [user_id], (err, result) => {
    if (result.length > 0) {
      db.query(
        "UPDATE budget SET monthly_budget=? WHERE user_id=?",
        [amount, user_id],
        () => res.json({ message: "Updated" })
      );
    } else {
      db.query(
        "INSERT INTO budget (user_id,monthly_budget) VALUES (?,?)",
        [user_id, amount],
        () => res.json({ message: "Created" })
      );
    }
  });
};

exports.summary = (req, res) => {
  const user_id = req.query.user_id;

  db.query(
    "SELECT IFNULL(SUM(amount),0) AS spent FROM expenses WHERE user_id=?",
    [user_id],
    (err, spent) => {
      db.query(
        "SELECT IFNULL(monthly_budget,0) AS budget FROM budget WHERE user_id=?",
        [user_id],
        (err, budget) => {
          res.json({
            spent: spent[0].spent,
            budget: budget[0]?.budget || 0
          });
        }
      );
    }
  );
};
