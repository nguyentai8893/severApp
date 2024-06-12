const mongoose = require('mongoose');

const orderProduct = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Products',
		require: true,
	},
	totalPrice: { type: Number, require: true },
});
const Order = mongoose.model('Order', orderProduct);
module.exports = Order;
