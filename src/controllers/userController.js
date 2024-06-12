const bcrypt = require('bcryptjs');
const User = require('../model/Users');
const jwt = require('jsonwebtoken');

const { body, validationResult, header } = require('express-validator');

const superAdmin = async (req, res, next) => {
	const { name, email, password, phone } = req.body;
	try {
		// Kiểm tra xem đã có tài khoản super admin trong cơ sở dữ liệu chưa
		const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
		if (existingSuperAdmin) {
			return res
				.status(400)
				.json({ message: 'Super admin account already exists' });
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.json({
				message: 'Định dạng email không hợp lệ.',
				status: false,
			});
		}
		const phoneRegex = /^\d{10}$/;
		if (!phoneRegex.test(phone)) {
			return res.json({
				message: 'Định dạng số điện thoại không hợp lệ.',
				status: false,
			});
		}
		const hashedPassword = await bcrypt.hash(password, 10);

		// Tạo một tài khoản mới với vai trò super admin
		const superAdminUser = new User({
			userName: name,
			email,
			phoneNumber: phone,
			password: hashedPassword,
			role: 'admin',
		});
		await superAdminUser.save();

		return res
			.status(201)
			.json({ message: 'Super admin account created successfully' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal server error' });
	}
};
const register = async (req, res, next) => {
	const { name, email, password, phone } = req.body;
	try {
		const existingUser = await User.findOne({ userName: name });
		if (existingUser) {
			// Nếu userName đã tồn tại, trả về thông báo lỗi
			return res.json({ message: 'UserName đã tồn tại!', status: false });
		}
		// Kiểm tra các điều kiện đầu vào
		if (name.length < 5) {
			return res.json({
				message: 'Tên người dùng phải có ít nhất 6 ký tự.',
				status: false,
			});
		}

		// Kiểm tra định dạng email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.json({
				message: 'Định dạng email không hợp lệ.',
				status: false,
			});
		}

		// Kiểm tra định dạng số điện thoại (ví dụ)
		const phoneRegex = /^\d{10}$/;
		if (!phoneRegex.test(phone)) {
			return res.json({
				message: 'Định dạng số điện thoại không hợp lệ.',
				status: false,
			});
		}

		// Kiểm tra độ dài mật khẩu
		if (password.length < 6) {
			return res.json({
				message: 'Mật khẩu phải có ít nhất 6 ký tự.',
				status: false,
			});
		}

		// Mã hóa mật khẩu
		const hashedPassword = await bcrypt.hash(password, 10);

		// Tạo mới người dùng và lưu vào cơ sở dữ liệu
		const newUser = await User({
			userName: name,
			email,
			password: hashedPassword,
			phoneNumber: phone,
			role: 'guest',
		});
		await newUser.save();
		return res.status(200).json({
			message: 'Đăng ký người dùng thành công.',
			status: true,
			newUser,
		});
	} catch (error) {
		console.log(error.message);
	}
};
const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email: email });
		if (user == null || !(await bcrypt.compare(password, user.password))) {
			return res.json({
				status: false,
				message: 'Invalid emaill or password  !',
			});
		}

		const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
			expiresIn: '5h',
		});
		res.cookie(
			'user',
			{
				userId: user._id,
				email: user.email,
				role: user.role,
			},
			{
				httpOnly: true,
				maxAge: 24 * 60 * 60 * 10000, // 1 day
				secure: process.env.NODE_ENV === 'production' ? true : false,
				sameSite: 'none',
			}
		);
		// Lưu thông tin người dùng vào session
		req.session.user = {
			userId: user._id,
			email: user.email,
			role: user.role,
		};
		return res.json({
			status: true,
			user: user,
			message: 'Đăng nhập thành công',
		});
	} catch (error) {
		return res.status(500).json({ message: `server error ${error} !` });
	}
};
const getAllUser = async (req, res) => {
	const users = await User.find();
	if (!users) return;
	return res.status(200).json({ users });
};
const editUser = async (req, res) => {
	const { id } = req.params;
	const { role } = req.body;
	const userEdit = await User.findByIdAndUpdate(
		id,
		{
			role,
		},
		{ new: true }
	);
	return res.json({ status: 200, userEdit });
};
module.exports = {
	superAdmin,
	register,
	login,
	getAllUser,
	editUser,
};
