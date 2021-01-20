const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let accounting_guide = new Schema({
    name:String,
    type:String,
});

module.exports = mongoose.model('accounting_guide',accounting_guide)
