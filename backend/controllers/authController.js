const db = require("../database/db");
const sendEmail = require("../utils/emailServices");

exports.register = (req, res) => {

const { name, email, phone, password } = req.body;

const sql = "INSERT INTO users (name,email,phone,password) VALUES (?,?,?,?)";

db.query(sql,[name,email,phone,password],(err,result)=>{

if(err){
console.log("REGISTER ERROR:",err);
return res.status(500).json({message:"Registration failed"});
}

console.log("USER REGISTERED:",email);

/* EMAIL TRIGGER */

sendEmail(
email,
"Welcome to BudgetPro",
`Hello ${name},

Welcome to BudgetPro.

Your account has been created successfully.`
);

res.json({
message:"Registration successful"
});

});

};

/* LOGIN */

exports.login=(req,res)=>{

const {loginId,password}=req.body;

const sql="SELECT * FROM users WHERE (email=? OR phone=?) AND password=?";

db.query(sql,[loginId,loginId,password],(err,result)=>{

if(err) return res.status(500).json({message:"Server error"});

if(result.length===0)
return res.status(401).json({message:"Invalid credentials"});

const user=result[0];

/* LOGIN EMAIL ALERT */

sendEmail(

user.email,

"BudgetPro Login Alert",

`Hello ${user.name},

Your BudgetPro account was just logged in.

your account has been created successfully.`

);

res.json({

message:"Login successful",
userId:user.id,
name:user.name

});

});

};