const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema(
	{
		userId: String,
		roomId: String,
		messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
	},
	{ timestamps: true }
);
const Rooms = mongoose.model('Rooms', roomSchema);
module.exports = Rooms;
