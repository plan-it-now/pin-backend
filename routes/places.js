
'use strict'

var express = require('express');
var router = express.Router();
var places = require('../controllers/placeController');
var helper = require('../helper/authJWT');

/* GET users listing. */
router.get('/', helper.verify, places.getAllPlaces);

router.get('/city/:city', helper.verify, places.getPlacesByCity);

router.get('/:id', helper.verify, places.getPlaceById);

router.post('/', helper.verify, places.postPlace)

router.put('/:id', helper.verify, places.updatePlace )

router.delete('/:id', helper.verify, places.deletePlace)


module.exports = router;
