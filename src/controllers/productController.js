const Products = require('../model/Product');
const CartItems = require('../model/CartItems');
const Order = require('../model/Order');
const { sendOrderConfirmationEmail } = require('../config/nodeMailer');
const fs = require('fs');
const path = require('path');

const getProducts = async (req, res, next) => {
	try {
		const products = await Products.find();
		return res.json({ status: 200, products });
	} catch (error) {
		console.log(error);
	}
};

const addCart = async (req, res, next) => {
	const { userId, product, quantity } = req.body;
	try {
		const cartItems = await CartItems.findOne({
			idUser: userId,
			idProduct: product._id,
		});

		if (cartItems) {
			(cartItems.quantity += quantity),
				(cartItems.totalPrice = cartItems.quantity * cartItems.price);
			await cartItems.save();
		} else {
			await CartItems.create({
				name: product.name,
				idUser: userId,
				idProduct: product._id,
				category: product.category,
				image: product.img1,
				quantity,
				price: product.price,
				totalPrice: product.price * quantity,
			});
		}

		// Sau khi thực hiện thêm hoặc cập nhật giỏ hàng, trả về giỏ hàng của người dùng
		const userCart = await CartItems.find({ idUser: userId });
		return res.json({
			status: 200,
			message: 'Thêm vào giỏ hàng thành công!',
			userCart,
		});
	} catch (error) {
		console.log(error);
	}
};

const getCart = async (req, res, next) => {
	const userId = req.query.userId;
	const cartItems = await CartItems.find({ idUser: userId });
	return res.json({ status: 200, message: ' get cart suscess !!', cartItems });
};

const updateProductCart = async (req, res, next) => {
	const { idUser, idProduct, newQuantity } = req.body;
	try {
		const cartItems = await CartItems.find({ idUser, idProduct });
		if (!cartItems) {
			return res.status(404).json({ message: 'Cart not found' });
		}
		// Lặp qua từng sản phẩm trong giỏ hàng và cập nhật số lượng cho sản phẩm có ID tương ứng
		for (let i = 0; i < cartItems.length; i++) {
			const cartItem = cartItems[i];
			cartItem.quantity = newQuantity;
			await cartItem.save();
		}
		const updateCart = await CartItems.find();
		return res.json({ status: 200, message: 'Update successful', updateCart });
	} catch (error) {
		console.error('Error updating quantity:', error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
const deleteProductCart = async (req, res, next) => {
	const { id } = req.params;
	try {
		// Tìm sản phẩm trong giỏ hàng để xác nhận sự tồn tại của nó
		const cartItem = await CartItems.findOne({ idProduct: id });
		if (!cartItem) {
			return res.status(404).json({ message: 'Product not found in cart' });
		}

		// Xóa sản phẩm từ giỏ hàng
		await CartItems.deleteOne({ idProduct: id });

		// Trả về phản hồi thành công
		const cartItems = await CartItems.find();
		return res.json({
			status: 200,
			message: 'Product has been deleted from cart',
			cartItems,
		});
	} catch (error) {
		console.error('Error deleting product:', error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

const orderProduct = async (req, res, next) => {
	try {
		// Nhận dữ liệu đơn hàng từ frontend
		const orderData = req.body;
		// Trừ số lượng sản phẩm từ tồn kho
		for (const product of orderData.products) {
			const productInStock = await Products.findById({
				_id: product.idProduct,
			});
			if (!productInStock) {
				return res.json({ status: 200, message: 'product not found!' });
			}
			if (productInStock.quantity < product.quantity) {
				return res.json({
					status: 200,
					message: 'số lượng sản trong kho không đủ.!',
				});
			}
			productInStock.quantity -= product.quantity;
			await productInStock.save();
		}
		// Tạo một bản ghi mới trong cơ sở dữ liệu đơn hàng
		const newOrder = await Order.create(orderData);
		// Gửi email xác nhận đơn hàng cho khách hàng
		await sendOrderConfirmationEmail(newOrder);
		const order = await Order.find();
		return res.status(201).json({ success: true, order });
	} catch (error) {
		// Xử lý lỗi nếu có lỗi xảy ra trong quá trình xử lý yêu cầu
		res.status(500).json({
			success: false,
			error: 'An error occurred while processing the request',
		});
	}
};
const getOrder = async (req, res, next) => {
	const userId = req.query.userId;

	const order = await Order.find({ 'customer.idUser': userId });
	return res.json({ status: 200, order });
};
const getOrders = async (req, res, next) => {
	const order = await Order.find();
	return res.json({ status: 200, order });
};
const createProduct = async (req, res) => {
	try {
		console.log('ok', req.body);
		const { name, price, category, short_desc, long_desc, image, quantity } =
			req.body;
		const newProduct = new Products({
			category,
			img1: image[0],
			img2: image[1],
			img3: image[2],
			img4: image[3],
			quantity,
			long_desc,
			name,
			price,
			short_desc,
		});
		await newProduct.save();
		// // Xóa ảnh từ thư mục public
		// fs.unlinkSync(`public/uploads${imageUrl}`);
		res.json({ status: 201, message: 'add product sussces ! ', newProduct });
	} catch (error) {
		console.error('Error saving product:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
const uploadImage = async (req, res) => {
	// Kiểm tra xem có tệp nào được tải lên từ client không
	if (!req.files || req.files.length === 0) {
		return res.status(400).json({ message: 'No files uploaded' });
	}
	const imageUrls = {};
	// Gán đường dẫn của từng ảnh vào thuộc tính tương ứng của đối tượng
	req.files.forEach((file, index) => {
		imageUrls[`image${index + 1}`] = file.path.replace(
			'src\\',
			'https://server-web-tmdt-0d81a84104bb.herokuapp.com'
		);
	});
	res.status(200).json({ filesPath: imageUrls });
};
const deleteProduct = async (req, res) => {
	const { id } = req.body;
	const deletedProduct = await Products.findByIdAndDelete(id);

	if (!deletedProduct) {
		return res.status(404).json({ message: 'Product not found' });
	}

	return res.json({
		status: 200,
		message: 'Product deleted successfully',
		deletedProduct,
	});
};
const updateProduct = async (req, res) => {
	const productId = req.params.id;
	const { name, price, long_desc, short_desc, category, image, quantity } =
		req.body;
	//cập nhập sản phẩm
	const updatedProduct = await Products.findByIdAndUpdate(
		productId,
		{
			name: name,
			price: price,
			long_desc,
			category,
			short_desc,
			quantity,
			img1: image?.image1,
			img2: image?.image2,
			img3: image?.image3,
			img4: image?.image4,
		},
		{ new: true }
	);
	console.log('ok');
	// Phản hồi với sản phẩm đã được cập nhật
	return res.json({ status: 200, updatedProduct });
};
module.exports = {
	getProducts,
	addCart,
	getCart,
	updateProductCart,
	deleteProductCart,
	orderProduct,
	getOrder,
	createProduct,
	uploadImage,
	deleteProduct,
	updateProduct,
	getOrders,
};
