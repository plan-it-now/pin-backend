'use strict'

var express = require('express');
var router = express.Router();
var helper = require('../helper/authJWT');

var itinerary = require('../controllers/itineraryController');

router.get('/', helper.verify, itinerary.getAllItinerary);

router.get('/user/:id', helper.verify, itinerary.getItineraryByUser);

router.get('/:id', helper.verify, itinerary.getItineraryById);

router.post('/', helper.verify, itinerary.postItinerary);

router.put('/:id', helper.verify, itinerary.updateItinerary);

router.delete('/:id', helper.verify, itinerary.deleteItinerary);


module.exports = router;
