'use strict';

const { model, Schema } = require('mongoose');

module.exports = model('Reservation', new Schema({
    // ID of customer (reference to 'Customer' table)
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    // ID of table (reference to 'Table' table)
    table: {
        type: Schema.Types.ObjectId,
        ref: 'Table'
    },
    // Number of guests for reservation
    noGuests: Number,
    // Date and time for reservation
    date: Date
}, { timestamps: true }));