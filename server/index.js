require('dotenv').config();
const { DATABASE_URL, PORT } = require('./config');
const path = require('path');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let secret = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET
}

if (process.env.NODE_ENV != 'production') {
    secret = require('./secret');
}

const app = express();
app.use(passport.initialize());

// API endpoints go here!
app.get('/api', (req, res) => {
    res.send('Hello World.');
});

// Authentication endpoints
passport.use(
    new GoogleStrategy({
        clientID: secret.CLIENT_ID,
        clientSecret: secret.CLIENT_SECRET,
        callbackURL: `/api/auth/google/callback`
    },
        (accessToken, refreshToken, profile, cb) => {
            User
                .findOneAndUpdate({
                    googleId: profile.id,
                    displayName: profile.displayName
                },
                {
                    $set: {
                        accessToken: accessToken,
                        googleId: profile.id
                    }
                }, {
                    upsert: true,
                    new: true
                })
                .then((user) => {
                    return cb(null, user);
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    ));

passport.use(
    new BearerStrategy(
        (token, done) => {
            User
                .findOne({ accessToken: token })
                .then((user) => {
                    if (user) {
                        return done(null, user);
                    }
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    )
);

app.get('/api/auth/google',
    passport.authenticate('google', {
        scope: ['profile']
    }));

app.get('/api/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/',
        session: false
    }),
    (req, res) => {
        res.cookie('accessToken', req.user.accessToken, { expires: 0 });
        res.redirect('/');
    }
);

app.get('/api/auth/logout', (req, res) => {
    req.logout();
    res.clearCookie('accessToken');
    res.redirect('/');
});


// Serve the built client
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Unhandled requests which aren't for the API should serve index.html so
// client-side routing using browserHistory can function
app.get(/^(?!\/api(\/|$))/, (req, res) => {
    const index = path.resolve(__dirname, '../client/build', 'index.html');
    res.sendFile(index);
});

let server;
function runServer(port = 3001) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl = DATABASE_URL, err => {
            if (err) {
                return reject(err);
            }
        });
        server = app.listen(port, () => {
            resolve();
        }).on('error', (err) => {
            mongoose.disconnect();
            reject(err);
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            server.close((err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer();
}

module.exports = {
    app, runServer, closeServer
};
