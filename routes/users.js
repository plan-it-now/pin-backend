'use strict'

var express = require('express');
var router = express.Router();
var user = require('../controllers/userController');
/* GET users listing. */
router.get('/', user.getAllUsers);
router.get('/userdata', user.decodedUser)
router.get('/:id', user.getUserById)
router.post('/', user.postUser)
router.put('/:id', user.updateUser)
router.delete('/:id', user.deleteUser)



module.exports = router;
