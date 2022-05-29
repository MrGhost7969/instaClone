const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const Account = new Schema({
    username: String,
    password: String
})

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account)
