const Rooms = require('../model/Rooms');

const getMessage = async (req, res) => {
	const { roomId } = req.query;
	try {
		const room = await Rooms.findOne({ roomId }).populate('messages');
		if (room) {
			res.status(200).json({ messages: room.messages });
		} else {
			res.status(404).json({ error: 'Phòng không tồn tại' });
		}
	} catch (error) {
		res.status(500).json({ error: 'Lỗi khi lấy tin nhắn' });
	}
};

const getRoom = async (req, res) => {
	try {
		const rooms = await Rooms.find().populate('messages');
		res.status(200).json({ rooms });
	} catch (error) {
		res.status(500).json({ error: 'Lỗi khi lấy danh sách phòng' });
	}
};
module.exports = {
	getMessage,
	// getRooms,
	getRoom,
};
