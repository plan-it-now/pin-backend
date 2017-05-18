'use strict'

var express = require('express');
var router = express.Router();
var user = require('../controllers/userController');
var helper = require('../helper/authJWT');

/* GET users listing. */
router.get('/', helper.verify, user.getAllUsers);
router.get('/userdata', user.decodedUser)
router.get('/:id',helper.verify, user.getUserById)
router.post('/', user.postUser)
router.put('/:id',helper.verify, user.updateUser)
router.delete('/:id', helper.verify, user.deleteUser)



module.exports = router;
