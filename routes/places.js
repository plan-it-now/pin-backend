
'use strict'

var express = require('express');
var router = express.Router();
var places = require('../controllers/placeController');

/* GET users listing. */
router.get('/', places.getAllPlaces);

router.get('/:id', (req,res) => {
  res.send({place:'yuhuy'})
})

router.post('/', (req,res) => {
  res.send('success post user');
})

router.put('/', (req,res) => {
  res.send('success update place');
})

router.delete('/:id', places.deletePlace)


module.exports = router;
