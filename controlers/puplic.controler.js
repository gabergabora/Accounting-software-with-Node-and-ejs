const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secret = 'This Is Any Secret Key To Encrypt Mu Data';
const userModel = require("../models/users.model");




// get home page
exports.home = async(req,res) =>{
    var userData = req.userData; // user, auth, role
   
    return res.render('index',{
        title:'الصفحة الرئيسية',
        auth : userData.auth,
        user:userData.user ?userData.user:'',
        role:userData.role ?userData.role:''
    })
}


// get singup page
exports.singup = async(req,res) =>{
    return res.render('singup',{title:'تسجيل حساب جديد'})
}

// post singup account in DB
exports.singupUser = async(req,res) => {
    try{
var data = req.body;
var user = await userModel.find({email:data.EmailAddress}).exec();
if(user.length!=0) return res.status(200).json({status:'false'});
 
let hash = bcrypt.hashSync(data.Password,10)

newUser = new userModel({
    firstName:       data.firstName,
    lastName:        data.LastName,
    email:           data.EmailAddress,
    password:        hash,
    phone:           data.inputphonenumber,
    role:            'user',
    address:         data.inputAddress,
})

let saving =await newUser.save();

// creat Token
var payload = { userId:saving._id, role:saving.role };
var Token = jwt.sign(payload, secret);

return res.cookie("T",Token,{}).status(200).json({status:'user created succusfully'});
}catch(e){
    console.log(e)
}
}


// post login account
exports.loginUser = async(req,res) =>{
    try{
    // some code
    var body = req.body;
    // find user
    var user = await userModel.findOne({email:body.email});
    if(!user)return res.status(200).json({auth:'faild',message:'البريد الالكتروني او كلمة السر خطأ !'})
    
    // match pass
    var match = await bcrypt.compare(body.password , user.password);
    if(!match) return res.status(200).json({auth:'faild',message:"البريد الالكتروني او كلمة السر خطأ !"})
    
    // creat Token
    var payload = { userId:user._id, role:user.role };
    var Token = jwt.sign(payload, secret);

    // what is the user role ? to redirect him 

    return res.cookie("T",Token,{}).status(200).json({auth:'scceeded', role:user.role});
}catch(e){
    console.log("ERROR : "+e)
}
}

// logout
exports.logout = async(req,res) => {
    return res.clearCookie('T').redirect('/');
}

