'use strict'

const data = require('./seeder/place.json');
const Place = require('../models/place');

module.exports = {
  seedDataPlace: (req, res) => {
    Place.collection.insert(data, (err, results) => {
      if(err) {
        res.send({error: err})
      } else {
        res.send(results)
      }
    });
  },
  getAllPlaces: (req, res) => {
    Place.find((err,places) => {
      if(err) {
        res.json({error:err});
      } else {
        res.json(places);
      }
    })
  },
  getPlacesByCity: (req, res) => {
    Place.find({city:req.params.city}, (err,places) => {
      if(err) {
        res.json({error:err});
      } else {
        res.json(places);
      }
    })
  },
  getPlaceById: (req, res) => {
    Place.findById(req.params.id, (err,place) => {
      if(err) {
        res.json({error:err});
      } else {
        res.json(place);
      }
    })
  },
  deletePlace: (req, res) => {
    Place.findByIdAndRemove(req.params.id, (err, deletedUser) => {
      if(err) {
        res.send({error:err});
      } else {
        res.send(deletedUser);
      }
    })
  },
  updatePlace: (req, res) => {
    Place.findById(req.params.id, (err, place) => {
      if(err) {
        res.send({error:err})
      } else {
        place.name = req.body.name || place.name;
        place.city = req.body.city || place.city;
        place.description = req.body.description || place.description;
        place.tag = req.body.tag || place.tag;
        place.photo = req.body.photo || place.photo;
        place.loc.latitude = req.body.latitude || place.loc.latitude;
        place.loc.longitude = req.body.longitude || place.loc.longitude;

        place.save((err, updatedPlace) => {
          if(err) {
            res.send({error:err});
          } else {
            res.send(updatedPlace);
          }
        })
      }
    })
  },
  postPlace: (req, res) => {
    const newPlace = new Place({
      name: req.body.name,
      city: req.body.city,
      description: req.body.description,
      tag: req.body.tag,
      photo: req.body.photo,
      loc: {
        latitude: req.body.latitude,
        longitude: req.body.longitude
      },
      details_url: req.body.details_url
    })

    newPlace.save((err, place) => {
      if(err) {
        res.send({error:err});
      } else {
        res.send(place);
      }
    })
  }
};
