'use strict';

const router = new (require('express')).Router;

const { AuthController } = require('../../controllers');

// Customer login
router.post('/customer', AuthController.login(false));

// Admin login
router.post('/admin', AuthController.login(true));

module.exports = router;