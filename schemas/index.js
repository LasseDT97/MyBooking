'use strict';

const AdminSchema = require('./admin');
const AuthSchema = require('./auth');
const CustomerSchema = require('./customer');
const ReservationSchema = require('./reservation');

module.exports = {
    AdminSchema,
    AuthSchema,
    CustomerSchema,
    ReservationSchema
};