const jwt = require('jsonwebtoken');
const User = require('../models/user');

require('dotenv').config();

module.exports = {
  verify: (req,res,next) => {
    jwt.verify(req.headers.token, process.env.SECRET_KEY, (err, decoded) => {
      if(err) {
        res.send({error:err});
      }
      else {
        User.findOne({email: decoded.email}, (err, user) => {
          if(err) {
            res.send({error:err});
          } else if (user == null){
            res.send({error: 'Token not valid!'});
          } else {
            next();
          }
        })
      }
    })
  }
};
