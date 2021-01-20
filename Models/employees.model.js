const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let employees = new Schema({
    employee:String
});

module.exports = mongoose.model('employees',employees)
