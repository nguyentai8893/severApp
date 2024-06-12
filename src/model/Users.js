const mongose = require('mongoose');
const { ROLES } = require('../config/global.enum');
const Schema = mongose.Schema;

const userSchema = new Schema(
	{
		userName: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		phoneNumber: { type: String, required: true },
		email: { type: String, require: true, unique: true },
		role: {
			type: String,
			enum: Object.values(ROLES), // Định nghĩa các giá trị cho vai trò
			default: ROLES.GUEST, // Mặc định vai trò là guest
		},
	},
	{ timestamps: true }
);
const User = mongose.model('User', userSchema);
module.exports = User;
