const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { route } = require('./productsRouter');
const { authorize } = require('../Middleware/authenticate');
const { ROLES } = require('../config/global.enum');

router.post('/api/register', userController.register);
router.post('/api/admin-register', userController.superAdmin);
router.post('/api/login', userController.login);
router.post(
	'/api/edit-user/:id',
	authorize([ROLES.ADMIN]),
	userController.editUser
);
router.get(
	'/api/get-user-client',
	authorize([ROLES.ADMIN]),
	userController.getAllUser
);

module.exports = router;
