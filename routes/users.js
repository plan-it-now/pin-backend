'use strict'

var express = require('express');
var router = express.Router();
var user = require('../controllers/userControllers');
/* GET users listing. */
router.get('/', user.getAllUsers);

router.get('/:id', (req,res) => {
  res.send({user:'ahoy'})
})

router.post('/', user.postUser)

router.put('/:id', user.updateUser)

router.delete('/:id', user.deleteUser)



module.exports = router;
