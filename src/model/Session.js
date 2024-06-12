const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
	message: [{ type: String }],
	startTime: { type: Date, default: Date.now },
	endTime: { type: Date },
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
