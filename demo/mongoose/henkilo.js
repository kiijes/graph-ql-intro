const mongoose = require('mongoose');
const ViestiSchema = require('./viesti');

const HenkiloSchema = new mongoose.Schema({
    nimi: { type: String, default: "Anon" },
    ika: Number,
    viestit: [ViestiSchema]
});

module.exports = HenkiloSchema;