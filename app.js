require('dotenv').config()

const mongoose = require('mongoose');
mongoose.connection.on('connected', () => console.log(`Mongoose connected to ${process.env.DBURL}`));
mongoose.connection.on('disconnected', () => console.log("Mongoose disconnected."));
mongoose.connect(process.env.DBURL);

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var unitsRouter = require('./routes/units');
var ticketsRouter = require('./routes/tickets');
var loginService = require('./services/login');
var usersService = require('./services/users');
const {passport} = require('./security/securityutils');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/index', indexRouter);
app.use('/api/login', loginService);
app.use('/api/users', usersService);

// jwt token authenticator
app.use(passport.initialize());
app.use('/api/', passport.authenticate('jwt', {
        session: false,
        failWithError: true
    }));

app.use('/api/users', usersRouter);
app.use('/api/units', unitsRouter);
app.use('/api/tickets', ticketsRouter);
  
// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({ message: err.message })
});

async function shutdown(callback) {
    await mongoose.disconnect();
    if (callback) callback();
    else
        process.exit(0);
}
  
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.once('SIGUSR2', () => {
    shutdown(() => process.kill(process.pid, 'SIGUSR2'));
});

module.exports = app;
