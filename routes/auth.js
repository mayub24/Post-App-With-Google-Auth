const express = require('express');
const router = express.Router();
const passport = require('passport');

// Auth with Google
// auth/google
router.get('/', passport.authenticate('google', { scope: ['profile'] }));


// CALLBACK
// auth/google/callback
router.get('/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect to dashboard.
        res.redirect('/dashboard');
    });

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
})

module.exports = router;
