'use strict';

const jwt = require('jsonwebtoken');

class Jwt {
    sign(id, isAdmin = false) {
        // Sign a Json Web Token (JWT) with secret from environment
        return jwt.sign({ 
            id: id, 
            isAdmin,
            iat: Math.floor(Date.now() / 1000) - 30, // Backdate issue time 30 seconds
            exp: Math.floor(Date.now() / 1000) + (60*60*48) // Set expiration time to +2 days
        }, process.env.JWT_SECRET);
    }

    // Verify a Json Web Token (JWT) with secret from environment
    verify(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
};

module.exports = new Jwt();