var express = require('express');
var router = express.Router();
const placeControl = require('../controllers/placeController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/seed-data', placeControl.seedDataPlace);

module.exports = router;
