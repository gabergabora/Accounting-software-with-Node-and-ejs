const jwt = require("jsonwebtoken");
const secret = 'This Is Any Secret Key To Encrypt Mu Data';
const userModel = require("../models/users.model");



exports.isLogin = async (req,res,next)=>{
    try{
        var Token = req.cookies.T;
        if(!Token){
            req.userData={auth:'failed',user:''}; 
            return next(); 
        }else{
        var decode  =  jwt.verify(Token,secret)
        var user    = await userModel.findById({_id:decode.userId}).exec();
        req.userData = {auth:'succeeded',user:user, Id:decode.userId, role:decode.role}
        next();
        }
        
    }catch(e){
        res.status(404).json({Message: "Authentication Failed", error:e})
    }
};

exports.notAllowToLoginAgain = async (req,res,next) => {
    try{
        var Token = req.cookies.T;
        if(!Token){
            return next(); 
        }else{
          return res.redirect('/')
        }
    }catch(e){
        res.status(404).json({Message: "Not can deyect if login or no", error:e})
    }
};

exports.accounterOnlyPages = async (req,res,next) => {
    try{
        if(req.userData.role && req.userData.role == "accounter")return next();
            return res.redirect('/')
        
    }catch(e){
        res.status(404).json({Message: "Not can deyect if login or no", error:e})
    }
};


//  API
exports.accounterOnlyFunctions_API = async (req,res, next) =>{
    try{
        if(req.userData.role == "accounter")return next();
            return res.status(200).json({status:false,msg:'notAllow'})
        
    }catch(e){
        res.status(404).json({Message: "Not can deyect if login or no", error:e})
    }
}