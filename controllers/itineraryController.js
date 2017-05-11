'use strict'

const Itinerary = require('../models/itinerary');

module.exports = {
  getAllItinerary: (req, res) => {
    Itinerary.find((err,itineraries) => {
      if(err) {
        res.json({error:err});
      } else {
        res.json(itineraries);
      }
    })
  },
  getItineraryById: (req, res) => {
    Itinerary.findById(req.params.id, (err,itinerary) => {
      if(err) {
        res.json({error:err});
      } else {
        res.json(itinerary);
      }
    })
  },
  postItinerary: (req, res) => {
    const newItinerary = new Itinerary({
      user: req.body.user,
      places: req.body.places
    })

    newItinerary.save((err, itinerary) => {
      if(err) {
        res.send({error:err})
      } else {
        res.send(itinerary);
      }
    })
  },
  updateItinerary: (req, res) => {
    Itinerary.findByIdAndUpdate(req.params.id, {
      user: req.body.user,
      places: req.body.places
    }, {new: true},
    (err, updatedItinerary) => {
      if(err) {
        res.send({error:err});
      } else {
        res.send(updatedItinerary);
      }
    })
  },
  deleteItinerary: (req, res) => {
    Itinerary.findByIdAndRemove(req.params.id, (err, deletedItinerary) => {
      if(err) {
        res.send({error:err});
      } else {
        res.send(deletedItinerary);
      }
    })
  }
};
