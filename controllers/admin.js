'use strict';

const { Admin } = require('../models');
const { Bcrypt, Errors } = require('../helpers');
const { AdminSchema } = require('../schemas');

class AdminController {
    async update(req, res) {
        let validation = AdminSchema.update.validate(req.body, { abortEarly: false });

        // Check if validation failed
        if (validation.error) {
            return res.status(400).json({
                status: 'err',
                errors: Errors.translate(validation.error.details)
            });
        }

        // Check if admin has set a new password
        if (validation.value.password === '')
            validation.value.password = undefined;

        // Update admin
        await req.auth.user.overwrite(validation.value).save();
        
        return res.status(201).json({
            status: 'ok'
        });
    }
};

module.exports = new AdminController();