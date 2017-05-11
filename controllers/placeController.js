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
    Place.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      city: req.body.city,
      description: req.body.description,
      tag: req.body.tag,
      photo: req.body.photo,
      loc: {
        latitude: req.body.latitude,
        longitude: req.body.longitude
      },
      detail_url: req.body.detail_url
    }, {new: true},
    (err, updatedPlace) => {
      if(err) {
        res.send({error:err});
      } else {
        res.send(updatedPlace);
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
      detail_url: req.body.detail_url
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
