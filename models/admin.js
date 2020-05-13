'use strict';

const { model, Schema } = require('mongoose');

module.exports = model('Admin', new Schema({
    // Admin's username
    username: String,
    // Admin's password
    password: String
}, { timestamps: true }));