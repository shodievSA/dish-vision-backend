require('./config/loadEnv')();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const aiRouter = require('./routes/ai');
const authRouter = require('./routes/auth');

const app = express();

const allowedOrigins = ['http://localhost:5173'];

app.use(express.json({ limit: '10mb' }));

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`${origin} origin is not allowed!`));
        }
    },
    credentials: true
}));

// we use express-session middleware to store user's id
app.use(session({
    secret: 'some secret key',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());

app.use(passport.session());

app.use('/api/v1/ai', aiRouter);

app.use('/api/v1/auth', authRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;
