'use strict';

const { Admin, Customer } = require('../models');
const { Jwt } = require('../helpers');

class AuthMiddleware {
    // Parse JWT token and get user from DB
    tokenParser() {
        return async (req, res, next) => {
            // Assume user is not authenticated
            req.auth = {
                isAuthenticated: false
            };

            // Get the token from the client cookies
            let token = req.cookies.token;

            // Token is not set, user not authenticated
            if(token === undefined) 
                return next();

            // Use helper Jwt class to verify token
            try {
                token = Jwt.verify(token);
                req.auth.token = token;
            } catch (error) {
                return next();
            }


            // Check if token is for admin or customer
            let model;
            if (token.isAdmin)
                model = Admin;
            else
                model = Customer;

            // Fetch user (customer/admin) from Database
            let user;
            try {
                user = await model.findById(token.id);
            } catch (error) {
                return next();
            }

            // If user was found, set authenticated to 'true'
            if (user) {
                req.auth.user = user;
                req.auth.isAuthenticated = true;
            }

            return next();
        }
    }

    // Redirect user if not logged in
    guard(protectionLevel) {
        return (req, res, next) => {
            if (protectionLevel == 'customer') {
                // Check if user is not authenticated
                if (!req.auth.isAuthenticated) {
                    return res.redirect(302, '/login');
                } else {
                    return next();
                }
            }
            else if(protectionLevel == 'admin') {
                // Check if user is not authenticated or not admin role
                if (!req.auth.token.isAdmin || !req.auth.isAuthenticated) {
                    return res.redirect(302, '/login?admin');
                } else {
                    return next();
                }
            }
        }
    }

    // Redirect user if already logged in
    noLogin() {
        return async (req, res, next) => {
            // Check if user is already authenticated
            if (req.auth.isAuthenticated) {
                return res.redirect(302, '/dashboard');
            }
    
            return next();
        }
    }
};

module.exports = new AuthMiddleware();