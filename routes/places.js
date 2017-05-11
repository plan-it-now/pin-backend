
'use strict'

var express = require('express');
var router = express.Router();
var places = require('../controllers/placeController');

/* GET users listing. */
router.get('/', places.getAllPlaces);

router.get('/:id', (req,res) => {
  res.send({place:'yuhuy'})
})

router.post('/', places.postPlace)

router.put('/:id', places.updatePlace )

router.delete('/:id', places.deletePlace)


module.exports = router;
