const PositonSchema = require('../MongooseSchema/PositionSchema')
const {model} =require('mongoose')

const PositionModel = model('position',PositonSchema);
module.exports = PositionModel;