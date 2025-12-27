const jwt = require("jsonwebtoken");

exports.protect = (req,res,next)=>{
  const token = req.headers.authorization;
  if(!token) return res.status(401).json({msg:"No token provided"});

  const data = jwt.verify(token,process.env.JWT_SECRET);
  req.user = data;
  next();
};
