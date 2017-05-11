'use strict'

var express = require('express');
var router = express.Router();

var itinerary = require('../controllers/itineraryController');

router.get('/', itinerary.getAllItinerary);

router.get('/:id', itinerary.getItineraryById);

router.post('/', itinerary.postItinerary);

router.put('/:id', itinerary.updateItinerary);

router.delete('/:id', itinerary.deleteItinerary);


module.exports = router;
