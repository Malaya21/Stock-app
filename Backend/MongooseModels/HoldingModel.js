const mongoose = require('mongoose');
const HoldingSchema = require('../MongooseSchema/HoldingSchema');

const HoldingModel = mongoose.model('Holding', HoldingSchema);

module.exports = HoldingModel;