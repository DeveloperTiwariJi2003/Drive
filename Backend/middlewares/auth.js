const jwt = require("jsonwebtoken");
function auth(req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({message:"No Token"});
    }


    const token = authHeader.split(" ")[1];

    try{

        const decoded = jwt.verify(token,process.env.Key);

        req.userId = decoded.userId;

        next();

    }
    catch(err){

        return res.status(401).json({
            message:"Token expired or invalid"
        });

    }
}
module.exports = auth;