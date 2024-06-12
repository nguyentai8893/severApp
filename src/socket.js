const socketIo = require('socket.io');
const Message = require('./model/Message');
const Rooms = require('./model/Rooms');
function setupSocket(server) {
	const io = socketIo(server, {
		cors: {
			origin: [
				'https://admin-dashboard-rho-snowy.vercel.app',
				'https://client-app-tmdt.vercel.app',
			], // Replace with the appropriate port of your client-app
			methods: ['GET', 'POST'],
		},
	});
	let activeRooms = {}; // Biến lưu trữ các phòng chat đang hoạt động
	io.on('connection', (socket) => {
		console.log('Client mới kết nối');

		socket.on('createRoom', async ({ roomId }) => {
			let room = await Rooms.findOne({ roomId });
			if (!room) {
				room = new Rooms({ userId: roomId, roomId });
				await room.save();
				socket.join(roomId);
				console.log('roomid', room);
				io.emit('roomCreated', room);
			}
		});

		socket.on('joinRoom', async (roomId) => {
			socket.join(roomId);
			const room = await Rooms.findOne({ roomId }).populate('messages');
			if (room) {
				socket.emit('loadMessages', room.messages);
			}
		});

		socket.on('sendMessage', async ({ roomId, newMessage }) => {
			if (newMessage.content === '/end') {
				await Rooms.findOneAndDelete({ roomId });
				io.to(roomId).emit('roomEnded', roomId);
				io.in(roomId).socketsLeave(roomId);
				console.log(`Phòng ${roomId} đã bị xóa.`);
			}
			const message = new Message({
				roomId,
				sender: newMessage.sender,
				content: newMessage.content,
			});
			await message.save();

			const room = await Rooms.findOne({ roomId });
			if (!room) {
				console.log('room', room);
			}

			if (room) {
				room.messages.push(message._id);
				await room.save();
				io.to(roomId).emit('receiveMessage', { newMessage: message });
			}
		});

		socket.on('disconnect', () => {
			console.log('Client ngắt kết nối');
		});
	});
	return activeRooms;
	app.get('/active-rooms', (req, res) => {
		// Endpoint để lấy danh sách các phòng đang hoạt động
		res.json(activeRooms);
	});
}

module.exports = { setupSocket };
