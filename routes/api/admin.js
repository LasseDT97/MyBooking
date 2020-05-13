'use strict';

const router = new (require('express')).Router;

const { AdminController } = require('../../controllers');
const { AuthMiddleware } = require('../../middleware');

// Update admin (settings)
router.put('/', AuthMiddleware.guard('admin'), AdminController.update);

module.exports = router;