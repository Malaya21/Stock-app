const {Schema} = require('mongoose')

const HoldingSchema = new Schema(
    {
        name: String,
        qty: Number,
        avg: Number,
        Tprice: Number,
       ltp:Number
      }
)
module.exports = HoldingSchema;