'use strict';

const AdminController = require('./admin');
const AuthController = require('./auth');
const CustomerController = require('./customer');
const ReservationController = require('./reservation');
const TableController = require('./table');

module.exports = {
    AdminController,
    AuthController,
    CustomerController,
    ReservationController,
    TableController
};