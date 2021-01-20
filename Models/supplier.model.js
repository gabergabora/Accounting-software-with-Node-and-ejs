// supplier
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let suppliers = new Schema({
    supplier:String
});

module.exports = mongoose.model('suppliers',suppliers)
