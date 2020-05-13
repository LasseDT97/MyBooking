'use strict';

const { Customer } = require('../models');
const { CustomerSchema } = require('../schemas');
const { Jwt, Errors } = require('../helpers');

class CustomerController {
    async create(req, res) {
        let validation = CustomerSchema.create.validate(req.body, { abortEarly: false });

        // Check if validation failed
        if (validation.error) {
            return res.status(400).json({
                status: 'err',
                errors: Errors.translate(validation.error.details)
            });
        }
        
        // Find existing customer
        let customerExists = await Customer.exists({ 
            $or: [
                { 'email': validation.value.email }, 
                { 'phone': validation.value.phone }
            ]
        });

        // Check if a customer was found
        if (customerExists) {
            return res.status(400).json({
                status: 'err',
                errors: Errors.translate([
                    {
                        path: ['user'],
                        type: 'exists'
                    }
                ])
            });
        }

        // Create and save new customer
        let customer = await new Customer(validation.value).save();

        // Create customer authentication token and set in cookie 'token'
        res.cookie('token', Jwt.sign(customer._id), {
            httpOnly: true,
            expire: Math.floor(Date.now() / 1000) + (60*60*48) // Expire cookie in 2 days
        });

        return res.status(201).json({
            status: 'ok'
        });
    }

    async update(req, res) {
        let validation = CustomerSchema.update.validate(req.body, { abortEarly: false });

        // Check if validation failed
        if (validation.error) {
            return res.status(400).json({
                status: 'err',
                errors: Errors.translate(validation.error.details)
            });
        }

        if (validation.value.password === '')
            validation.value.password = undefined;

        // Update customer
        await req.auth.user.overwrite(validation.value).save();

        return res.status(201).json({
            status: 'ok'
        });
    }
};

module.exports = new CustomerController();