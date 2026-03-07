const express = require("express");
const router = express.Router();

const db = require("../database/db");
const sendEmail = require("../utils/emailServices");

/* REGISTER */

router.post("/register", (req, res) => {

const { name, email, phone, password } = req.body;

if (!name || !email || !phone || !password) {
 return res.status(400).json({ message: "All fields required" });
}

const sql = "INSERT INTO users (name,email,phone,password) VALUES (?,?,?,?)";

db.query(sql,[name,email,phone,password],(err)=>{

 if(err){
  console.log(err);
  return res.status(500).json({ message:"Registration failed"});
 }

 sendEmail(
  email,
  "Welcome to BudgetPro",
  `Hello ${name},

Welcome to BudgetPro.

Your account has been created successfully.`
 );

 res.json({message:"Registered successfully"});

});

});


/* LOGIN */

router.post("/login",(req,res)=>{

const {loginId,password}=req.body;

if(!loginId || !password){
 return res.status(400).json({message:"All fields required"});
}

const sql="SELECT * FROM users WHERE (email=? OR phone=?) AND password=?";

db.query(sql,[loginId,loginId,password],(err,result)=>{

 if(err){
  console.log(err);
  return res.status(500).json({message:"Server error"});
 }

 if(result.length===0){
  return res.status(401).json({message:"Invalid credentials"});
 }

 const user=result[0];

 /* LOGIN EMAIL */

 sendEmail(
  user.email,
  "BudgetPro Login Alert",
  `Hello ${user.name},

Your BudgetPro account was just logged in.`
 );

 res.json({
  userId:user.id,
  name:user.name
 });

});

});

module.exports = router;