const API = "http://localhost:5000/api";
const USER_ID = localStorage.getItem("user_id");

if (!USER_ID) {
  window.location.href = "./auth/login.html";
}

let summaryChart = null;
let categoryChart = null;

document.addEventListener("DOMContentLoaded", () => {

  const summaryChartCanvas = document.getElementById("summaryChart");
  const categoryChartCanvas = document.getElementById("categoryChart");

  const spent = document.getElementById("spent");
  const budgetAmount = document.getElementById("budgetAmount");
  const remaining = document.getElementById("remaining");

  const updateBudgetBtn = document.getElementById("updateBudgetBtn");
  const dashboardBudgetInput = document.getElementById("dashboardBudgetInput");

  const addExpenseBtn = document.getElementById("addExpenseBtn");
  const expenseAmount = document.getElementById("expenseAmount");
  const expenseCategory = document.getElementById("expenseCategory");

  window.showPage = function (id) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");

    if (id === "analytics") loadCategoryChart();
    if (id === "history") loadHistory();
  };

  function loadSummary() {
    fetch(`${API}/summary?user_id=${USER_ID}`)
      .then(res => res.json())
      .then(data => {
        spent.textContent = "₹" + data.spent;
        budgetAmount.textContent = data.budget;
        remaining.textContent = "₹" + (data.budget - data.spent);
        drawSummaryChart(data.spent, data.budget - data.spent);
      });
  }

  function drawSummaryChart(spentVal, remainingVal) {

    if (summaryChart) summaryChart.destroy();

    summaryChart = new Chart(summaryChartCanvas, {
      type: "bar",
      data: {
        labels: ["Spent", "Remaining"],
        datasets: [{
          data: [spentVal, remainingVal],
          backgroundColor: ["#ff6b6b", "#51cf66"]
        }]
      },
      options: {
        plugins: { legend: { display: false } }
      }
    });
  }

  function loadHistory() {
    fetch(`${API}/expenses?user_id=${USER_ID}`)
      .then(res => res.json())
      .then(data => {

        const tbody = document.getElementById("historyBody");
        tbody.innerHTML = "";

        if (data.length === 0) {
          tbody.innerHTML = "<tr><td colspan='4'>No expenses yet</td></tr>";
          return;
        }

        data.forEach(item => {
          const tr = document.createElement("tr");

          tr.innerHTML = `
            <td>${item.expense_date}</td>
            <td>${item.expense_time}</td>
            <td>${item.category}</td>
            <td>₹${item.amount}</td>
          `;

          tbody.appendChild(tr);
        });
      });
  }

  function loadCategoryChart() {
    fetch(`${API}/expenses?user_id=${USER_ID}`)
      .then(res => res.json())
      .then(data => {

        const totals = {};

        data.forEach(e => {
          totals[e.category] = (totals[e.category] || 0) + Number(e.amount);
        });

        if (categoryChart) categoryChart.destroy();

        categoryChart = new Chart(categoryChartCanvas, {
          type: "pie",
          data: {
            labels: Object.keys(totals),
            datasets: [{
              data: Object.values(totals)
            }]
          }
        });
      });
  }

  updateBudgetBtn.onclick = () => {

    fetch(`${API}/budget`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: USER_ID,
        amount: dashboardBudgetInput.value
      })
    })
    .then(res => res.json())
    .then(() => {
      dashboardBudgetInput.value = "";
      loadSummary();
    });
  };

  addExpenseBtn.onclick = () => {

    fetch(`${API}/expense`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: USER_ID,
        amount: expenseAmount.value,
        category: expenseCategory.value
      })
    })
    .then(res => res.json())
    .then(() => {
      expenseAmount.value = "";
      loadSummary();
      loadHistory();
    });
  };

  loadSummary();
  loadHistory();

});
