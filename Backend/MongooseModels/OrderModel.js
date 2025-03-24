const OrderSchema = require('../MongooseSchema/OrderSchema');

const { model } = require('mongoose');

const OrderModel = model('order', OrderSchema);

module.exports = OrderModel;
