const jsonwebtoken = require('jsonwebtoken');
const authorization = function(req,res,next){
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1];

   if(token == null) return res.sendStatus(401);
   try{
    let result = jsonwebtoken.verify(token,process.env.SECRET);
    if(result){
        req.email=result.email;
        req.fullname=result.fullname;
        next();
    }else{
        res.sendStatus(500).json({message:"Invalid token"});
    }
   }catch(error){
    res.sendStatus(401).json({message:"Token verification failed",error:error.message});
   }
}
module.exports = authorization;
