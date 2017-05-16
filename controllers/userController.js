'use strict'

const User = require('../models/user');
const jwt = require('jsonwebtoken');
const pwh = require('password-hash');

require('dotenv').config();

module.exports = {
  login: (req, res) => {
    User.findOne({'email':req.body.email}, (err, user) => {
      if(err) {
        res.send({error:err})
      }
      else if(!user){
        res.send({error:"user not found"})
      } else {
        if(pwh.verify(req.body.password,user.password)) {
          const newToken = jwt.sign({email: user.email, name: user.name, pref: user.pref}, process.env.SECRET_KEY);
          user.password = null
          res.send({token: newToken, userdata: user});
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
            user.password = null
            res.send({token: newToken, userdata: user});
          }
        })

      }
    })
  },
  loginFb: (req,res) => {
    User.findOne({email: req.body.email},(err, user) => {
      if(err) {
        res.send({error:err})
      } else if(user) {
        const newToken = jwt.sign({_id: user._id, email: user.email, name: user.name, pref: user.pref}, process.env.SECRET_KEY);
        res.send({token: newToken})
      } else {

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
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
            const newToken = jwt.sign({_id: user._id, email: user.email, name: user.name, pref: user.pref}, process.env.SECRET_KEY);
            user.password = null
            res.send({token: newToken, userdata: user});
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
    User.findById(req.params.id, function (err, user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;
      user.pref = req.body.pref || user.pref;

      user.save((err,updatedUser) => {
        if(err) {
          res.send({error:err});
        } else {
          res.send(updatedUser);
        }
      })
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
  },
  getUserById: (req, res) => {
    User.findById(req.params.id, function(err, user) {
      if(err) {
        res.send({error: err});
      } else {
        res.send(user)
      }
    })
  },
  decodedUser: (req, res) => {
    jwt.verify(req.headers.token, process.env.SECRET_KEY, (err, decoded) => {
      if(decoded) {
        User.findOne({email: decoded.email}, (err, user) => {
          if(err || user == null) {
            res.send({error:err});
          } else {
            user.password = null
            res.send(user);
          }
        })
      } else {
        res.send({error:err});
      }
    })
  }
};
