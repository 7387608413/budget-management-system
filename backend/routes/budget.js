const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");

router.post("/", budgetController.updateBudget);
router.get("/summary", budgetController.summary);

module.exports = router;
