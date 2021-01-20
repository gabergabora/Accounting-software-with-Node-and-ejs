const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let cost_center = new Schema({
    cost:String
});

module.exports = mongoose.model('cost',cost_center)
