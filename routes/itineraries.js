var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.send([]);
});

router.get('/:id', (req,res) => {
  res.send({itinerary:'ahoy'})
})

router.post('/', (req,res) => {
  res.send('success post itinerary');
})

router.put('/', (req,res) => {
  res.send('success update itinerary');
})

router.delete('/:id', (req,res) => {
  res.send('succes delete itinerary');
})


module.exports = router;
