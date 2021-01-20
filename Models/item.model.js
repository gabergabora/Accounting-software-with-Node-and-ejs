const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let item = new Schema({
    item:String
});

module.exports = mongoose.model('item',item)

