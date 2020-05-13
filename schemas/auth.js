'use strict';

const joi = require('@hapi/joi');

class AuthSchema {
    login = joi.object().keys({
        username: joi.string().required(),
        password: joi.string().required(),
    });
};

module.exports = new AuthSchema();