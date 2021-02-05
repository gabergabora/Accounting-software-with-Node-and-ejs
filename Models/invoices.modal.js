const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


let invoice = new Schema({
    RegistrationNumber:Number,
    invoiceNumber : Number,
    date:Date,
    ExplainTheLimitation: String,

    items:[
            {
                item:{
                type:Schema.ObjectId,
                ref:'accounting_guide',
                    },
                count:Number,
                price:Number,
                descound : Number,
                TotalBeforeDescound : Number,
                TotalAfterDescound : Number,
            }
        ],

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