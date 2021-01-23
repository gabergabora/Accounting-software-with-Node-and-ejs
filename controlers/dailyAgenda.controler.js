const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secret = 'This Is Any Secret Key To Encrypt Mu Data';
const userModel = require("../Models/users.model");
const cost_centerModal = require("../Models/cost_center.model")
const itemModal = require("../Models/item.model")
const employeesModal = require("../Models/employees.model")
const suppliersModal = require("../Models/supplier.model");
const clientsModal   = require("../Models/clients.model");
const accounting_guideModel = require('../Models/accounting_guide.model')
const invoicesModal = require('../Models/invoices.modal');


// async function supplierAccounting(){
// var supps = await accounting_guideModel.find({type:'supplier'}).exec();
// // var DebtorAccount   = await invoicesModal.find({DebtorAccount:supps}).populate('DebtorAccount')
// // var CreditorAccount = await invoicesModal.find({CreditorAccount:supps}).populate('CreditorAccount')

// // send array of objs , every one contain {'nameOfSupplier':'ahmed' , 'TotalDebtorAccount':45000 , TotalCreditorAccount:2000 , ''}

// var suppliers = []

// for (i of supps ){
// var DebtorAccount   = await invoicesModal.find({DebtorAccount:i._id}).populate('DebtorAccount')
// var CreditorAccount   = await invoicesModal.find({CreditorAccount:i._id}).populate('CreditorAccount')
// // console.log(DebtorAccount)

// var sup = {}
// var TotalD = 0
// var TotalC = 0
// // DebtorAccount
// if(DebtorAccount.length !=0){
//     for(x of DebtorAccount){
//         sup.name  = x.DebtorAccount.name
//         TotalD += x.Total
//     }
//     sup.DebtorAccount = TotalD

// }

// // CreditorAccount
// if(CreditorAccount.length !=0){
//     for(y of CreditorAccount){
//     TotalC += y.Total
//     }
//     sup.DebtorAccount = TotalC
// }
// suppliers.push(sup)
// console.log(sup)

// }
// console.log(suppliers)
// }
// supplierAccounting()

exports.dailyAgenda = async (req,res)=>{
try{
    let query = req.query;
    let newQuery = {}

    if(query.invoiceNumber)  newQuery.invoiceNumber = query.invoiceNumber
    if(query.item)  newQuery.item = query.item
    if(query.DebtorAccount)  newQuery.DebtorAccount = query.DebtorAccount
    if(query.CreditorAccount)  newQuery.CreditorAccount = query.CreditorAccount
    
    if(query.fromDate && query.toDate){
        newQuery.date ={
            $gte: query.fromDate,
            $lt: query.toDate
        }
    }else if(query.fromDate) {
        newQuery.date = query.fromDate
    }else if(query.toDate)  {
        newQuery.date ={$lt: query.toDate}
    }
      
    
var guide = await accounting_guideModel.find({type:'guide'}).exec();
var cost  = await accounting_guideModel.find({type:'cost'}).exec();
var item  = await accounting_guideModel.find({type:'item'}).exec();
var employee = await accounting_guideModel.find({type:'employee'}).exec();
var supplier = await accounting_guideModel.find({type:'supplier'}).exec();
var client  = await accounting_guideModel.find({type:'client'}).exec();


let count = await invoicesModal.countDocuments()
var perPage = 50 ;
var page = (req.params.curentPage <=0)?1:req.params.curentPage || 1;
var invoice = await invoicesModal.find(newQuery)
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
        query:query,
        search:req._parsedOriginalUrl.search
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