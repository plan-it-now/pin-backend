var express = require('express');
var router = express.Router();
const place = require('../controllers/placeController');
const user = require('../controllers/userController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/seed-data', place.seedDataPlace);
router.post('/login', user.login);
router.post('/login-fb', user.loginFb);
router.post('/signup', user.signup);

module.exports = router;
