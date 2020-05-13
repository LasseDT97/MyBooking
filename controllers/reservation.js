'use strict';

const { Reservation, Table } = require('../models');
const { Errors } = require('../helpers');
const { ReservationSchema } = require('../schemas');

const moment = require('moment');

const settings = require('../settings');

function dateRangeOverlaps(a_start, a_end, b_start, b_end) {
    if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
    if (a_start <= b_end   && b_end   <= a_end) return true; // b ends in a
    if (b_start <  a_start && a_end   <  b_end) return true; // a in b
    return false;
}

class ReservationController {
    // Get reservations
    async getReservations(auth) {
        let reservations;

        // Check if admin
        if (auth.token.isAdmin) {
            // Get all reservations and fill the 'table' and 'customer' fields with objects, sort by date in ascending order
            reservations = await Reservation.find().populate('table').populate('customer').sort([['date',1]]);
        } else {
            // Get current customer's reservations and fill the 'table' and 'customer' fields with objects, sort by date in ascending order
            reservations = await Reservation.find({ customer: auth.user._id }).populate('table').populate('customer').sort([['date',1]]);
        }

        return reservations;
    }

    // Delete a reservation
    async delete(req, res) {
        let { reservationId } = req.params;

        // Check if admin
        if (req.auth.token.isAdmin) {
            // Admin can delete reservation with no checks
            Reservation.deleteOne({ _id: reservationId }, function(err) {
                if (err) return res.status(404).send('');
                return res.status(200).send('');
            });
        } else {
            // Customer can only delete its own reservations
            Reservation.deleteOne({ _id: reservationId, customer: req.auth.user._id }, function(err) {
                if (err) return res.status(404).send('');
                return res.status(200).send('');
            });
        }
    }

    // Create new reservation
    async create(req, res) {
        let validation = ReservationSchema.create.validate(req.body, { abortEarly: false });

        // Check if validation failed
        if (validation.error) {
            return res.status(400).json({
                status: 'err',
                errors: Errors.translate(validation.error.details)
            });
        }
        
        // Get the desired date for reservation
        let date = moment(req.body.date);

        // Get the opening hours for the chosen week day
        let openingHours = settings.openingHours[date.weekday()];

        // Parse the opening hours to the customer's chosen day
        let openStart = moment(date.format('YYYY-MM-DD') + 'T' + openingHours[0]);
        let openEnd = moment(date.format('YYYY-MM-DD') + 'T' + openingHours[1]);
        
        // Check if customer's chosen time is not within opening hours
        if(!(date > openStart && date < openEnd)) {
            return res.status(401).json({
                status: 'err',
                errors: Errors.translate([{
                    path: ['reservation'],
                    type: 'closed'
                }])
            });
        }

        // Find table with number of seats equal to or greater than number of guests. Sort tables by seats in ascending order
        let tables = await Table.find({ noSeats: { $gte: req.body.noGuests } }).populate('reservations').sort([['noSeats', 1]]);
        let availableTable; // Will be used for the selected table
        
        // Loop through tables to find overlapping reservations
        for(let i = 0; i < tables.length; i++) {
            let table = tables[i];
            let isTableAvailable = true; // Assume table is available

            // Loop through reservations on a table
            for(let n = 0; n < table.reservations.length; n++) {
                let tableReservation = table.reservations[n];

                // If new reservation time lies between an exisiting reservation start and end, table is not available
                if (dateRangeOverlaps(moment(date), moment(date).add(settings.reservationTime, 'minutes'), moment(tableReservation.date), moment(tableReservation.date).add(settings.reservationTime, 'minutes'))) {
                    isTableAvailable = false;
                    break;
                }
            }

            // Table is available
            if (isTableAvailable) {
                availableTable = table;
                break;
            }
        }
        
        // Check if an available table was found
        if (availableTable == undefined) {
            // No available table was found
            return res.status(401).json({
                status: 'err',
                errors: Errors.translate([{
                    path: ['reservation'],
                    type: 'no.tables'
                }])
            });
        }

        // Create a new reservation with the available table
        let reservation = await new Reservation({
            customer: req.auth.user._id,
            table: availableTable._id,
            noGuests: req.body.noGuests,
            date
        }).save();

        // Update the table to include the newly created reservation
        availableTable.reservations.push(reservation._id);
        await availableTable.save();

        res.status(200).send('');
    }
};

module.exports = new ReservationController();