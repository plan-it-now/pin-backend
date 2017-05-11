'use strict'

const User = require('../models/user');
const jwt = require('jsonwebtoken');
const pwh = require('password-hash');

require('dotenv').config();

module.exports = {
  login: (req, res) => {
    User.findOne({'email':req.body.email}, (err, user) => {
      if(err || user == null) {
        res.send({error:err})
      } else {
        if(pwh.verify(req.body.password,user.password)) {
          const newToken = jwt.sign({email: user.email}, process.env.SECRET_KEY);
          res.send({token: newToken, id: user._id});
        } else {
          res.send({error: 'wrong password'});
        }
      }
    })
  },
  signup: (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
      if(err) {
        res.send({error:err})
      } else if(user) {
        res.send({error:'email is already exist'})
      } else {
        const hashedPassword = pwh.generate(req.body.password);

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          pref: {
            history: 50,
            nature: 50,
            architecture: 50,
            shopping: 50,
            art: 50
          }
        })

        newUser.save((err, user) => {
          if(err) {
            res.send({error: err})
          } else {
            const newToken = jwt.sign({email: user.email}, process.env.SECRET_KEY);
            res.send({token: newToken, id: user._id})
          }
        })

      }
    })
  },
  getAllUsers: (req, res) => {
    User.find((err,users) => {
      if(err) {
        res.json({error:err});
      } else {
        res.json(users);
      }
    })
  },
  postUser: (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      pref: {
        history: 50,
        nature: 50,
        architecture: 50,
        shopping: 50,
        art: 50
      }
    })

    newUser.save((err, user) => {
      if(err) {
        res.send({error:err})
      } else {
        res.send(user);
      }
    })
  },
  updateUser: (req, res) => {
    User.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      pref: req.body.pref
    }, {new: true},
    (err, updatedUser) => {
      if(err) {
        res.send({error:err});
      } else {
        res.send(updatedUser);
      }
    })
  },
  deleteUser: (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, deletedUser) => {
      if(err) {
        res.send({error:err});
      } else {
        res.send(deletedUser);
      }
    })
  }
};
