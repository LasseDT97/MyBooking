'use strict';

const { Table } = require('../models');

class TableController {
    async getTables() {
        // Find all tables and fill the list of reservations with objects instead of ID's
        let tables = await Table.find().populate('reservations');

        return tables;
    }

    // Create new table from admin dashboard
    async create(req, res) {
        try {
            // New table from request body
            let table = await new Table(req.body).save();
            return res.status(200).send('');
        } catch (error) {
            // Failed to create new table
            console.log(error);
            return res.status(401).send('');
        }
    }
};

module.exports = new TableController();