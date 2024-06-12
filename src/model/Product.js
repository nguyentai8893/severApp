const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema(
	{
		category: { type: String, require: true },
		name: { type: String, maxLength: 255, required: true },
		price: { type: String, require: true },
		short_desc: { type: String, required: true },
		long_desc: { type: String, required: true },
		img1: { type: String, maxLength: 255, required: true },
		img2: { type: String, maxLength: 255, required: false },
		img3: { type: String, maxLength: 255, required: false },
		img4: { type: String, maxLength: 255, required: false },
		img5: { type: String, maxLength: 255, required: false },
		quantity: { type: String, required: true, default: 0 },
	},
	{ timestamps: true }
);

const Products = mongoose.model('Products', productSchema);
module.exports = Products;
