const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secret = 'This Is Any Secret Key To Encrypt Mu Data';
const userModel = require("../models/users.model");
const cost_centerModal = require("../Models/cost_center.model")
const itemModal = require("../Models/item.model")
const employeesModal = require("../Models/employees.model")
const suppliersModal = require("../Models/supplier.model");
const clientsModal   = require("../Models/clients.model");
const accounting_guideModel = require('../Models/accounting_guide.model')
const invoicesModal = require('../Models/invoices.modal');



// wichCollection('5ff6e715714aed25a813ba09')
function GetFormattedDate() {
    var todayTime = new Date();
    var month = format(todayTime .getMonth() + 1);
    var day = format(todayTime .getDate());
    var year = format(todayTime .getFullYear());
    return month + "/" + day + "/" + year;
}

exports.dailyAgenda = async (req,res)=>{
try{
var guide = await accounting_guideModel.find({type:'guide'}).exec();
var cost  = await accounting_guideModel.find({type:'cost'}).exec();
var item  = await accounting_guideModel.find({type:'item'}).exec();
var employee = await accounting_guideModel.find({type:'employee'}).exec();
var supplier = await accounting_guideModel.find({type:'supplier'}).exec();
var client  = await accounting_guideModel.find({type:'client'}).exec();


let count = await invoicesModal.countDocuments()
var perPage = 50 ;
var page = (req.params.curentPage <=0)?1:req.params.curentPage || 1;
const invoice = await invoicesModal.find()
.sort({_id:-1})
.populate('item')
.populate('DebtorAccount') // , ongoing :true
.populate('CreditorAccount')
.skip((perPage * page) - perPage)
.limit(perPage)

return res.render('dailyAgenda',{
        title:'دفتر اليومية',
        user:req.userData.user,
        breadcrumb :'dailyAgenda',
        guides:guide,
        costs: cost,
        items:item,
        employees:employee,
        suppliers:supplier,
        clients:client,
        invoices:invoice,
        Pages:Math.ceil(count / perPage),
        current: page,
    })
}catch(e){
}
}




exports.AddInvoice = async (req,res) => {
try {
    var invoiceN = await invoicesModal.find({}).sort({_id:-1}).limit(1) ;
    
    var n = 10;
    if(invoiceN.length !=0) n = invoiceN.pop().invoiceNumber +10;

    let data = req.body;

    let invoice = new invoicesModal({
    invoiceNumber : n ,
        item: data.item,
        date    :data.date,
        ExplainTheLimitation : data.ExplainTheLimitation,
        count   :data.count,
        price   : data.price,
        Total : data.Total,
        DebtorAccount       :data.DebtorAccount,
        CreditorAccount     :data.CreditorAccount,
    })
    let saveInvoicce = await invoice.save();

    let invoiceData = await invoicesModal.findOne({_id:saveInvoicce._id}).populate('item').populate('DebtorAccount').populate('CreditorAccount');
    return res.status(200).json({status:true,msg:'تم حفظ الفاتورة بنجاح',invoice:invoiceData});
    } catch(e){
        return res.status(200).json({status:false,msg:'حدث خطأ , حاول مرة أخري !',errror:e});
    }
}

// Edite Invoice
exports.EditeInvoice = async (req,res) => {
try{
    let invoice = req.body;

    let getInvoice = await invoicesModal.findOne({_id:invoice._id});
   
     getInvoice.date                     = invoice.date;
     getInvoice.item                 = invoice.item;
     getInvoice.ExplainTheLimitation     = invoice.ExplainTheLimitation;
     getInvoice.DebtorAccount        = invoice.DebtorAccount;
     getInvoice.CreditorAccount      = invoice.CreditorAccount;
     getInvoice.count                    = invoice.count;
     getInvoice.price                    = invoice.price;
     getInvoice.Total                    = invoice.Total;

     let saveingInvoice = await getInvoice.save()
    
    let getNewInvoice = await invoicesModal.findOne({_id:invoice._id}).populate('item').populate('DebtorAccount').populate('CreditorAccount');

    return res.status(200).json({status:true,msg:'تم تعديل الفاتورة بنجاح', invoice:getNewInvoice});
    
}catch(e){
    console.log(e)
    return res.status(200).json({status:false,msg:'حدث خطأ , حاول مرة أخري !', errror:e});
}
}

exports.DeleteInvoice = async (req,res) => {
try{
    let id = req.body.id ;
    let deleteInvo = await invoicesModal.findOneAndDelete({_id : id});
    
    if(deleteInvo == null) return res.status(200).json({status:false,msg:'حدث خطأ , حاول مرة أخري !', errror:e});
   

    return res.status(200).json({status:true, msg:'تم حذف الفاتورة بنجاح'})
}catch(e){
    return res.status(200).json({status:false,msg:'حدث خطأ , حاول مرة أخري !', errror:e});
}
}