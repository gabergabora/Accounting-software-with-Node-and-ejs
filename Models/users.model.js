const mongoose = require('mongoose');

const schema = mongoose.Schema;
let user = new schema({
         firstName      :{type:String,required:true},
         lastName       :{type:String,required:true},
         email          :{type: String, require: true, index:true, unique:true,sparse:true},
         password       :{type:String,required:true},
         phone          :String,
         role             :{type:String,default:"user"},
         address        :String,
         profilePhoto   :{type:String,default:"null"},
         checked:{type:Boolean,default:false},
         token           :String,
         resetToken     :String ,
         resetTokenExpiration  :String,
    
},{timestamps:true});


module.exports= mongoose.model("users" , user);