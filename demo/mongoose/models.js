const mongoose = require('mongoose');
const HenkiloSchema = require('./henkilo');
const ViestiSchema = require('./viesti');

mongoose.model('Henkilo', HenkiloSchema);
mongoose.model('Viesti', ViestiSchema);

exports.HenkiloModel = mongoose.model('Henkilo');
exports.ViestiModel = mongoose.model('Viesti');