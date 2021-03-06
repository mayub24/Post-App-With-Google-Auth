var GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const UserModel = require('../models/UserModel');

// below is str8 from documentation
module.exports = async (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // callbackURL: "/auth/google/callback"
        callbackURL: "https://poster-app-google-auth.herokuapp.com/auth/google/callback"
    },
        async (accessToken, refreshToken, profile, doneLoading) => {
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value
            }

            try {
                let user = await UserModel.findOne({ googleId: profile.id });

                // if user exists
                if (user) {
                    doneLoading(null, user);
                }
                else {
                    user = await UserModel.create(newUser);
                    doneLoading(null, user);
                }

            } catch (err) {
                console.log(err);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        UserModel.findById(id, (err, user) =>
            done(err, user));
    });
}


