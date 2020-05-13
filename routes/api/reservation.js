'use strict';

const router = new (require('express')).Router;

const { ReservationController } = require('../../controllers');
const { AuthMiddleware } = require('../../middleware');

// Create new reservation
router.post('/', AuthMiddleware.guard('customer'), ReservationController.create);

// Delete reservation
router.delete('/:reservationId', AuthMiddleware.guard('customer'), ReservationController.delete);

module.exports = router;