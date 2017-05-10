'use strict'

const User = require('../models/user');

module.exports = {
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
