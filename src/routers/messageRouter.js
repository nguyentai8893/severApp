const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// router.get('/api/messages/list-rooms', messageController.getRooms);
router.get('/api/get-messages', messageController.getMessage);
router.get('/api/get-rooms', messageController.getRoom);

module.exports = router;
