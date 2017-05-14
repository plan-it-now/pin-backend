'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, unique: true},
  password: String,
  pref: {
    history: Number,
    nature: Number,
    architecture: Number,
    shopping: Number,
    art: Number
  }
},{
  timestamps: true
});

userSchema.plugin(uniqueValidator, { message: 'Email: {PATH} telah terdaftar' });
const User = mongoose.model('User', userSchema);

module.exports = User;
