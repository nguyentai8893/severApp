const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		console.log('file:::/n', file);
		cb(null, path.join(__dirname, './public/uploads'));
	},
	filename: function (req, file, cb) {
		// Tên file mới được tạo ra, bao gồm thời gian và phần mở rộng của file gốc
		cb(
			null,
			`${file.originalname}-${Date.now()}${path.extname(file.originalname)}`
		);
	},
});

const upload = multer({ storage });

module.exports = upload;
