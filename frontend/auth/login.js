const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const msg = document.getElementById("msg");
const regMsg = document.getElementById("regMsg");

function showRegister(){
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
}

function showLogin(){
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
}

loginForm.addEventListener("submit",async(e)=>{
  e.preventDefault();

  const loginId=document.getElementById("loginId").value;
  const password=document.getElementById("password").value;

  const res=await fetch("http://localhost:5000/api/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({loginId,password})
  });

  const data=await res.json();

  if(!res.ok){
    msg.innerText=data.message||"Login failed";
    return;
  }

  localStorage.clear();
  localStorage.setItem("user_id",data.userId);  // IMPORTANT
  localStorage.setItem("user_name",data.name);

  window.location.href="../index.html";
});

registerForm.addEventListener("submit",async(e)=>{
  e.preventDefault();

  const body={
    name:name.value,
    email:email.value,
    phone:phone.value,
    password:regPassword.value
  };

  const res=await fetch("http://localhost:5000/api/register",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(body)
  });

  const data=await res.json();

  if(!res.ok){
    regMsg.innerText=data.message||"Register failed";
    return;
  }

  regMsg.innerText="Registration successful. Login now.";
  showLogin();
});
