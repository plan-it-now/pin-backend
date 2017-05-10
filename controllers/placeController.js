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
  }
};
