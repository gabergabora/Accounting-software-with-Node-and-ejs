const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secret = 'This Is Any Secret Key To Encrypt Mu Data';
const userModel = require("../models/users.model");
const accounting_guideModel = require("../Models/accounting_guide.model")
const cost_center = require("../Models/cost_center.model")
const ITEMS = require("../Models/item.model")
const EMPLOYEES = require("../Models/employees.model")
const SUPPLIERS = require("../Models/supplier.model");
const CLIENTS   = require("../Models/clients.model");




// accounting
exports.accounting = async(req,res) =>{

    return res.render('dashborad_accounting',{
        title:'الحسابات',
        user:req.userData.user,
        breadcrumb :'accounting'
        
    })
};

// Accounting_guide
exports.Accounting_guide = async(req,res)=>{
    var guide = await accounting_guideModel.find({type:'guide'}).exec();
    var cost  = await accounting_guideModel.find({type:'cost'}).exec();
    var item  = await accounting_guideModel.find({type:'item'}).exec();
    var employee = await accounting_guideModel.find({type:'employee'}).exec();
    var supplier = await accounting_guideModel.find({type:'supplier'}).exec();
    var client  = await accounting_guideModel.find({type:'client'}).exec();

    return res.render('Accounting_guide',{
        title:'الدليل المحاسبي',
        user:req.userData.user,
        breadcrumb:'accounting_guide',
        guides:guide,
        costs: cost,
        items:item,
        employees:employee,
        suppliers:supplier,
        clients:client
    })
};


// Add accounting_guide
exports.AddAccounting_guide = async (req,res) =>{
try{
let g = req.body.name
let type = req.body.type
let  guide = await accounting_guideModel.find({name:g , type:type});

if(guide.length!=0) return res.status(200).json({status:false,msg:'عذرا  موجود بالفعل  !'});


let Aguide = new accounting_guideModel({
    name : g,
    type: type
});
let a = await Aguide.save();

return res.status(200).json({status:true,msg:'تم الحفظ بنجاح',guide:a})
}catch(e){
return res.status(200).json({status:false,msg:e});
}
};


// EditeAccounting_guide
exports.editeAccounting_guide = async(req,res) =>{
    try{
    var update = await accounting_guideModel.findOne({_id:req.body.id, type:req.body.type})
    update.name = req.body.value;
    let updateSave = await update.save()
    return res.status(200).json({status:true,msg:'تم حفظ التعديلات',guide:updateSave})
}catch(e){
    return res.status(200).json({status:false,msg:'عذرا حدث خطأ'})
}
}

// Delete Accounting_guide
exports.deleteAccounting_guide = async(req,res) => {
    try{
        let id =  req.body.id; // 5ff84c658d46ba2d205f2b0c
        let type =  req.body.type; 
        let guide = await accounting_guideModel.findOneAndDelete({_id:id,type:type}).exec();
        
        if(guide == null) return res.status(200).json({status:false,msg:'عذرا حدث خطأ', })
    return res.status(200).json({status:true, msg:'تم الحذف  بنجاح'}) ;
    }catch(e){
        console.log(e)
        return res.status(200).json({status:false,msg:'عذرا حدث خطأ', })
    }
}
