const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

router.post("/register",(req,res)=>{
  const {name,email,password,role} = req.body;
  const hash = bcrypt.hashSync(password,10);

  db.query(
    "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
    [name,email,hash,role || "user"],
    err=>{
      if(err) return res.status(400).json({msg:"User already exists"});
      res.json({msg:"Registration successful"});
    }
  );
});

router.post("/login",(req,res)=>{
  const {email,password} = req.body;

  db.query("SELECT * FROM users WHERE email=?",[email],(err,result)=>{
    if(result.length==0)
      return res.status(400).json({msg:"User not found"});

    const user = result[0];
    const valid = bcrypt.compareSync(password,user.password);
    if(!valid) return res.status(400).json({msg:"Wrong password"});

    const token = jwt.sign(
      {id:user.id, role:user.role},
      process.env.JWT_SECRET
    );

    res.json({token,role:user.role});
  });
});

module.exports = router;
