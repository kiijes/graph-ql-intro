const mongoose = require('mongoose');
const HenkiloSchema = require('./henkilo');

const ViestiSchema = new mongoose.Schema({
    lahettaja: String,
    sisalto: String
})

module.exports = ViestiSchema;