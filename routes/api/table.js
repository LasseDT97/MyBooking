'use strict';

const router = new (require('express')).Router;

const { TableController } = require('../../controllers');
const { AuthMiddleware } = require('../../middleware');

// Create new table
router.post('/', AuthMiddleware.guard('admin'), TableController.create);

module.exports = router;