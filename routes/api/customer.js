'use strict';

const router = new (require('express')).Router;

const { CustomerController } = require('../../controllers');
const { AuthMiddleware } = require('../../middleware');

// Customer register
router.post('/', CustomerController.create);

// Update customer (settings)
router.put('/', AuthMiddleware.guard('customer'), CustomerController.update);

module.exports = router;