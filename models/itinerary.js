'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  days: Number,
  places: [{
    place: {type: Schema.Types.ObjectId, ref: 'Place'},
    schedule: String,
    day: Number,
    orderIndex: Number
  }]
}, {
  timestamps: true
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;
