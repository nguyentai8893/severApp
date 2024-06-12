const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema(
	{
		roomId: { type: Schema.Types.ObjectId, ref: 'Rooms' },
		sender: String,
		content: String,
	},
	{ timestamps: true }
);
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
