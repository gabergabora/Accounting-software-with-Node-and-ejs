const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


let invoice = new Schema({
    RegistrationNumber:Number,
    invoiceNumber : Number,
    item:{
        type:Schema.ObjectId,
        ref:'accounting_guide',
    },
    date:Date,
    ExplainTheLimitation: String,
    count:Number,
    price:Number,
    descound : Number,
    TotalBeforeDescound : Number,
    TotalAfterDescound : Number,
    Total:Number,
    DebtorAccount   : {
                        type:Schema.ObjectId,
                        ref:'accounting_guide'
                    },
    CreditorAccount : {
        type:Schema.ObjectId,
        ref : 'accounting_guide',
    } ,

});

module.exports = mongoose.model('invoice',invoice)