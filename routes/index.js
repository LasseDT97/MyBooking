'use strict';

const router = new (require('express')).Router;

const { ReservationController, TableController } = require('../controllers');
const { AuthMiddleware } = require('../middleware')

router.get('/', AuthMiddleware.noLogin(), (req, res) => {
    res.render('pages/index', {
        title: `${process.env.PAGETITLE}`,
        auth: req.auth
    });
});

// Log in as admin / customer
router.get('/login', AuthMiddleware.noLogin(), (req, res) => {
    res.render('pages/login', {
        title: `${process.env.PAGETITLE} | Log Ind`,
        auth: req.auth,
        adminLogin: (req.query.admin !== undefined) // Check if visitor wants to log in as admin
    });
});

// Create new customer
router.get('/register', AuthMiddleware.noLogin(), (req, res) => {
    res.render('pages/register', {
        title: `${process.env.PAGETITLE} | Opret Bruger`,
        auth: req.auth
    });
});

// Dashboard for authenticated user
router.get('/dashboard', AuthMiddleware.guard('customer'), async (req, res) => {
    // Get the authenticated user's reservations. (Admin gets all reservations)
    let reservations = await ReservationController.getReservations(req.auth);
    let tables = [];

    // If authenticated user is an admin, get all the tables
    if (req.auth.token.isAdmin) {
        tables = await TableController.getTables();
    }
    
    return res.render('pages/dashboard', {
        title: `${process.env.PAGETITLE}`,
        auth: req.auth,
        reservations,
        tables
    });
});

// Settings for authenticated user
router.get('/settings', AuthMiddleware.guard('customer'), (req, res) => {
    if (req.auth.token.isAdmin) {
        return res.render('pages/settings-admin', {
            title: `${process.env.PAGETITLE}`,
            auth: req.auth
        });
    } else {
        return res.render('pages/settings-customer', {
            title: `${process.env.PAGETITLE}`,
            auth: req.auth
        });
    }
});

// Logout authenticated user
router.get('/logout', (req, res) => {
    res.clearCookie('token'); // Delete 'token' cookie
    res.redirect(302, '/');
});

// Include the 'api' routes
router.use('/api', require('./api'));

module.exports = router;