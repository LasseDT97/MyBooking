'use strict';

const joi = require('@hapi/joi');

class AdminSchema {
    update = joi.object().keys({
        username: joi.string().optional(),
        password: joi.string().min(5).allow('').optional(),
    });
};

module.exports = new AdminSchema();