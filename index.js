'use strict';

// Set up dotenv config
//dotenv is a module that loads environment variables from .env file into process.env
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const { AuthMiddleware } = require('./middleware');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const MONGOURL = process.env.MONGOURL || 'mongodb://localhost:27017/booking';
const PORT = process.env.PORT || 3000;

// Connect to MongoDB instance
mongoose.connect(MONGOURL, {
    // New MongoDB engine methods, otherwise deprecation warning
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(err) {
    if (err) { // Connect fail
        console.log(`Failed to connect to MongoDB on: ${MONGOURL}`);
        process.exit(0);
    } else { // Connect success
        console.log(`Connected to MongoDB on: ${MONGOURL}`);
    }

    require('./bootstrap')();
});

// New express app
const app = express();

// Express template engine
app.set('view engine', 'ejs');

const moment = require('moment');
moment.locale('da');
app.locals.moment = moment;

// Express middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(AuthMiddleware.tokenParser());

// Express routes
app.use(require('./routes'));

// Express static content
app.use('/static', express.static('./static'));

// Start express app
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
}).on('error', (error) => {
    console.log(error);
});