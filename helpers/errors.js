'use strict';

const i18n = require('./locale');

class Errors {
    // Convert Joi errors into localized and "human" errors
    translate(errors) {
        errors = errors.map(error => {
            // Make a short code
            error = `error.${error.path.join('_')}.${error.type}`;

            if (i18n[error] !== undefined)
                return i18n[error];
            else
                return error;
        });

        return errors;
    }
};

module.exports = new Errors();