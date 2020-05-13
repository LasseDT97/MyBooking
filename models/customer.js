'use strict';

const { model, Schema } = require('mongoose');


module.exports = model('Customer', new Schema({
    // Customer's first name
    firstName: String,
    // Customer's last name
    lastName: String,
    // Customer's email
    email: String,
    // Customer's phone number
    phone: String,
    // Customer's password for sign-in
    password: String
}, { timestamps: true }));