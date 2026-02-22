require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const budgetRoutes = require("./routes/budget");
const expenseRoutes = require("./routes/expense");

app.use("/api/auth", authRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/expense", expenseRoutes);

app.get("/", (req, res) => {
  res.send("BudgetPro API Running");
});

const PORT = 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
