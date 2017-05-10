'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placeSchema = new Schema({
  name: {type: String, required: true},
  city: {type: String, required: true},
  description: {type: String, required: true},
  tag: {type: String, required: true},
  photo: {type: String, required: true},
  loc: {
    latitude: Number,
    longitude: Number
  },
  detail_url: {type: String, required: true}
},{
  timestamps: true
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
