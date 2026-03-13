const express = require('express');
const router = express.Router();
const { adminLogin, terminalLogin } = require('../controllers/authController');

/**
 * Authentication endpoints
 */

// POST /api/auth/admin/login - Admin authentication
router.post('/admin/login', adminLogin);

// POST /api/auth/terminal/login - Terminal authentication
router.post('/terminal/login', terminalLogin);

module.exports = router;
