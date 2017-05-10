'use strict'

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.send([]);
});

router.get('/:id', (req,res) => {
  res.send({user:'ahoy'})
})

router.post('/', (req,res) => {
  res.send('success post user');
})

router.put('/', (req,res) => {
  res.send('success update user');
})

router.delete('/:id' (req,res) => {
  res.send('succes delete user');
})


module.exports = router;
