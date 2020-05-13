'use strict';

const router = new (require('express')).Router;

const AdminRouter = require('./admin');
const AuthRouter = require('./auth');
const CustomerRouter = require('./customer');
const ReservationRouter = require('./reservation');
const TableRouter = require('./table');

router.use('/admins', AdminRouter);
router.use('/auth', AuthRouter);
router.use('/customers', CustomerRouter);
router.use('/reservations', ReservationRouter);
router.use('/tables', TableRouter);

module.exports = router;

