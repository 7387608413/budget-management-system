const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const msg = document.getElementById("msg");
const regMsg = document.getElementById("regMsg");

/* ===== SWITCH FORMS ===== */
function showRegister(){
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
}

function showLogin(){
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
}

/* ===== LOGIN ===== */
loginForm.addEventListener("submit",async(e)=>{
  e.preventDefault();

  const loginId=document.getElementById("loginId").value.trim();
  const password=document.getElementById("password").value.trim();

  try{

    const res=await fetch("http://localhost:5000/api/auth/login",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({loginId,password})
    });

    const data=await res.json();

    if(!res.ok){
      msg.innerText=data.message||"Login failed";
      return;
    }

    /* CLEAR OLD DATA */
    localStorage.clear();

    /* SAVE USER DATA */
    localStorage.setItem("user_id",data.userId);
    localStorage.setItem("user_name",data.name);

    /* REDIRECT TO DASHBOARD */
    window.location.href="../dashboard/index.html";

  }catch(err){
    console.log("Login error:",err);
    msg.innerText="Server error";
  }

});

/* ===== REGISTER ===== */
registerForm.addEventListener("submit",async(e)=>{
  e.preventDefault();

  const body={
    name:document.getElementById("name").value.trim(),
    email:document.getElementById("email").value.trim(),
    phone:document.getElementById("phone").value.trim(),
    password:document.getElementById("regPassword").value.trim()
  };

  try{

    const res=await fetch("http://localhost:5000/api/auth/register",{
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

  }catch(err){
    console.log("Register error:",err);
    regMsg.innerText="Server error";
  }

});
