const API = "http://localhost:5000";
const USER_ID = localStorage.getItem("user_id");

/* AUTH CHECK */
if (!USER_ID) {
  window.location.href = "../auth/login.html";
}

/* PAGE SWITCH */
window.showPage = function(id){

  document.querySelectorAll(".page").forEach(function(page){
    page.classList.add("hidden");
  });

  const selectedPage = document.getElementById(id);

  if(selectedPage){
    selectedPage.classList.remove("hidden");
  }

  if(id === "analytics"){
    loadAnalytics();
  }

};

/* ================= NOTIFICATION ================= */

function showNotification(message,type){

  const box = document.getElementById("notificationBox");

  if(!box) return;

  box.textContent = message;

  box.classList.remove("hidden","notification-warning","notification-danger");

  if(type==="warning"){
    box.classList.add("notification-warning");
  }

  if(type==="danger"){
    box.classList.add("notification-danger");
  }

  setTimeout(function(){
    box.classList.add("hidden");
  },4000);

}

/* DOM READY */

document.addEventListener("DOMContentLoaded",function(){

const spentEl = document.getElementById("spent");
const budgetEl = document.getElementById("budgetAmount");
const remainingEl = document.getElementById("remaining");

const updateBudgetBtn = document.getElementById("updateBudgetBtn");
const budgetInput = document.getElementById("dashboardBudgetInput");

const addExpenseBtn = document.getElementById("addExpenseBtn");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");

/* ================= SUMMARY ================= */

function loadSummary(){

fetch(API + "/api/budget/summary?user_id=" + USER_ID)

.then(res=>res.json())

.then(data=>{

spentEl.textContent = "₹" + data.spent;
budgetEl.textContent = data.budget;
remainingEl.textContent = "₹" + (data.budget - data.spent);

const percent = data.budget > 0 ? (data.spent/data.budget)*100 : 0;

if(percent >= 100){
showNotification("Budget exceeded!","danger");
}
else if(percent >= 75){
showNotification("Warning: 75% of budget used","warning");
}

});

}

/* ================= HISTORY ================= */

function loadHistory(){

var historyList = document.getElementById("historyList");

historyList.innerHTML="";

fetch(API + "/api/expense?user_id=" + USER_ID)

.then(res=>res.json())

.then(function(data){

if(!data || data.length===0){

historyList.innerHTML="<p>No expenses yet</p>";

return;

}

data.forEach(function(item){

var dateObj = new Date(item.expense_date);

var formattedDate = dateObj.toLocaleDateString("en-IN");

var card = document.createElement("div");

card.className="history-card";

card.innerHTML=

"<div class='history-left'>"+
"<div class='history-category'>"+item.category+"</div>"+
"<div class='history-date'>"+formattedDate+" • "+item.expense_time+"</div>"+
"</div>"+
"<div class='history-amount'>₹"+item.amount+"</div>";

historyList.appendChild(card);

});

});

}

/* ================= UPDATE BUDGET ================= */

updateBudgetBtn.addEventListener("click",function(){

fetch(API + "/api/budget",{

method:"POST",

headers:{ "Content-Type":"application/json" },

body:JSON.stringify({

user_id:USER_ID,

amount:budgetInput.value

})

})

.then(res=>res.json())

.then(function(){

budgetInput.value="";

loadSummary();

});

});

/* ================= ADD EXPENSE ================= */

addExpenseBtn.addEventListener("click",function(){

fetch(API + "/api/expense",{

method:"POST",

headers:{ "Content-Type":"application/json" },

body:JSON.stringify({

user_id:USER_ID,

amount:expenseAmount.value,

category:expenseCategory.value

})

})

.then(res=>res.json())

.then(function(){

expenseAmount.value="";
expenseCategory.value="";

loadSummary();
loadHistory();

});

});

loadSummary();
loadHistory();

});

/* ================= ANALYTICS ================= */

let chartInstance=null;

function loadAnalytics(){

fetch(API + "/api/expense?user_id=" + USER_ID)

.then(res=>res.json())

.then(function(data){

const totals={};

data.forEach(function(item){

const amt=parseFloat(item.amount);

if(totals[item.category]){

totals[item.category]+=amt;

}
else{

totals[item.category]=amt;

}

});

const ctx=document.getElementById("categoryChart");

if(chartInstance){
chartInstance.destroy();
}

chartInstance=new Chart(ctx,{

type:"doughnut",

data:{
labels:Object.keys(totals),
datasets:[{
data:Object.values(totals)
}]
}

});

});

}