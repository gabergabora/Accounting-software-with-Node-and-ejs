const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let clients = new Schema({
    client:String
});

module.exports = mongoose.model('clients',clients)
