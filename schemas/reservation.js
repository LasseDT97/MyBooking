'use strict';

const joi = require('@hapi/joi');

class ReservationSchema {
    create = joi.object().keys({
        date: joi.date().required(),
        noGuests: joi.number().required()
    });
};

module.exports = new ReservationSchema();