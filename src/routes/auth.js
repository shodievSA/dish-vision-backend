require('dotenv').config({ path: '../../.env' });
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const router = express.Router();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: process.env['GOOGLE_CALLBACK_URL'],
    scope: ['profile', 'email']
}, (accessToken, refreshToken, profile, done) => {

    return done(null, profile);

}));

router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => { 
        res.redirect('http://localhost:5173/app'); 
    }
);

router.get('/logout', (req, res) => {

    req.logOut(() => {
        res.redirect('http://localhost:5173/sign-in');
    });

});

module.exports = router;