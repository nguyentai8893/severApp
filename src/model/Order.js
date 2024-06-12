const mongoose = require('mongoose');
const Schema = mongoose.Schema();

const OrderSchema = new mongoose.Schema({
	customer: {
		idUser: { type: String, require: true },
		name: { type: String, require: true },
		email: { type: String, require: true },
		tel: { type: String, require: true },
		address: { type: String, require: true },
	},
	products: [
		{
			name: { type: String, require: true },
			price: { type: Number, require: true },
			image: { type: String, require: true },
			quantity: { type: Number, require: true },
		},
	],
	totalPrice: { type: Number, require: true },
	status: { type: String, require: true },
	orderDate: Date,
});
const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
