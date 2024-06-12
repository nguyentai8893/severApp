const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cartItemsSchema = new Schema(
	{
		name: { type: String, require: true },
		idProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
		idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
		image: { type: String, require: true },
		product: { type: String, require: true },
		category: { type: String, require: true },
		price: { type: String, require: true },
		quantity: { type: Number, require: true },
		totalPrice: { type: Number, require: true },
	},
	{ timestamps: true }
);

const CartItems = mongoose.model('CartItems', cartItemsSchema);

module.exports = CartItems;
