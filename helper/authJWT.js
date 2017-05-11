const jwt = require('jsonwebtoken');
const User = require('../models/user');

require('dotenv').config();

module.exports = {
  verify: (req,res,next) => {
    jwt.verify(req.headers.token, process.env.SECRET_KEY, (err, decoded) => {
      if(decoded) {
        User.findOne({email: decoded.email}, (err, user) => {
          if(err || user == null) {
            res.send({error:err});
          } else {
            next();
          }
        })
      } else {
        res.send({error:err});
      }
    })
  }
};
