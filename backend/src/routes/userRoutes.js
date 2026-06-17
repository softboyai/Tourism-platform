const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/userAuthController');
const verifyUserToken = require('../middleware/userAuth');

// Public routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Protected user routes
router.get('/auth/me', verifyUserToken, getProfile);

module.exports = router;
