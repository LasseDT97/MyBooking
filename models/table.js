'use strict';

const { model, Schema } = require('mongoose');

module.exports = model('Table', new Schema({
    // List of reservations IDs (reference to 'Reservation' table)
    reservations: [{
        type: Schema.Types.ObjectId,
        ref: 'Reservation'
    }],
    // Table number (Friendly ID)
    tableNo: Number,
    // Number of seats at the table
    noSeats: Number
}, { timestamps: true }));
