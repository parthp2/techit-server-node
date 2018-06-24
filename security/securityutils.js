'use strict'
const bcrypt = require('bcrypt')
const saltRounds = 10
const passport = require('passport');
const passportJWT = require('passport-jwt');

const encodePassword = (password,callback)=>{
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            callback(err,hash)
        })
    })
}

const checkPassword = (raw_pass, encoded_pass, callback)=>{
    bcrypt.compare(raw_pass, encoded_pass, function(err, res) {
        callback(err,res)
    });
}

passport.use(new passportJWT.Strategy({
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}, function (payload, done) {
  return done(null, payload);
}));

module.exports = {passport, encodePassword, checkPassword};