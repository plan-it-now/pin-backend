'use strict'

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.send([]);
});

router.get('/:id', (req,res) => {
  res.send({place:'yuhuy'})
})

router.post('/', (req,res) => {
  res.send('success post user');
})

router.put('/', (req,res) => {
  res.send('success update place');
})

router.delete('/:id' (req,res) => {
  res.send('succes delete place');
})


module.exports = router;
