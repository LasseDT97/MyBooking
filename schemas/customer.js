'use strict';

const joi = require('@hapi/joi');

class CustomerSchema {
    create = joi.object().keys({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        email: joi.string().email().required(),
        phone: joi.string().length(8).regex(/^\d+$/),
        password: joi.string().min(6).required(),
    });

    update = joi.object().keys({
        firstName: joi.string().optional(),
        lastName: joi.string().optional(),
        email: joi.string().email().optional(),
        phone: joi.string().length(8).regex(/^\d+$/).optional(),
        password: joi.string().min(6).allow('').optional(),
    });
};

module.exports = new CustomerSchema();