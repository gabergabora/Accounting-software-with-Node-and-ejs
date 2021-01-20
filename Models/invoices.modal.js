const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


let invoice = new Schema({
    invoiceNumber : Number,
    item:{
        type:Schema.ObjectId,
        ref:'accounting_guide',
    },
    date:Date,
    ExplainTheLimitation: String,
    count:Number,
    price:Number,
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