'use strict';

const { Admin } = require('../models');

const BootStrap = async () => {
    if (! (await Admin.exists({ username: process.env.ADMIN_USER }))) {
        await new Admin({ username: process.env.ADMIN_USER, password: process.env.ADMIN_PASS }).save();
    }
};

module.exports = BootStrap;