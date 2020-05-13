'use strict';

const { Admin, Customer } = require('../models');
const { AuthSchema } = require('../schemas');
const { Errors, Jwt } = require('../helpers');

class AuthController {
    login(isAdmin = false) {
        return async (req, res, next) => {
            // Closure for authentication fail response
            const authFail = () => {
                return res.status(401).json({
                    status: 'err',
                    errors: Errors.translate([{
                        path: ['authentication'],
                        type: 'failed'
                    }])
                });
            };

            // Validate username/password fields
            let validation = AuthSchema.login.validate(req.body);
            if (validation.error)
                return authFail();

            // Find user (admin/customer)
            let user;
            if (isAdmin) {
                user = await Admin.findOne({ username: validation.value.username });
            } else {
                // Username can be either the email or phone
                user = await Customer.findOne({ 
                    $or: [
                        { email: validation.value.username },
                        { phone: validation.value.username }
                    ]
                });
            }

            // Check if a user was found by its username
            if (!user)
                return authFail();

            // Verify password match
            if (validation.value.password !== user.password)
                return authFail();

            // Generate user authentication token and set in cookie 'token'
            res.cookie('token', Jwt.sign(user._id, isAdmin), {
                httpOnly: true,
                expire: Math.floor(Date.now() / 1000) + (60*60*48) // Expire cookie in 2 days  
            });

            return res.status(200).json({
                status: 'ok'
            });
        }
    }
};

module.exports = new AuthController();