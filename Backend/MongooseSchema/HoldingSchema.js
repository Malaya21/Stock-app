const {Schema} = require('mongoose')

const HoldingSchema = new Schema(
    {
        name: String,
        qty: Number,
        avg: Number,
        Tprice: Number,
        ltp: Number,
        date: { 
            type: String, 
            default: () => {
                const options = { day: '2-digit', month: 'short', year: 'numeric' };
                return new Date().toLocaleDateString('en-GB', options).replace(/ /g, ' ');
            }
        },
        time: {
            type: String,
            default: () => {
                const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
                return new Date().toLocaleTimeString('en-GB', options);
            }
        }
    }
)
module.exports = HoldingSchema;