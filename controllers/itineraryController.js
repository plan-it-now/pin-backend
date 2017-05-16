'use strict'

const Itinerary = require('../models/itinerary');
const nodemail = require('nodemailer');
require('dotenv').config();

let transporter = nodemail.createTransport("SMTP", {
    service: 'hotmail',
    auth: {
      user: 'planitnow@outlook.com',
      pass: 'Testing123'
    }
});

module.exports = {
  getAllItinerary: (req, res) => {
    Itinerary.find((err,itineraries) => {
      if(err) {
        res.json({error:err});
      } else {
        res.json(itineraries);
      }
    })
  },
  getItineraryByUser: (req, res) => {
    Itinerary.find({user: req.params.id})
    .populate('places.place')
    .exec((err, itineraries) => {
      if(err){
        res.json({error: err});
      } else {
        res.json(itineraries);
      }
    })
  },
  getItineraryById: (req, res) => {
    Itinerary.findById(req.params.id, (err,itinerary) => {
      if(err) {
        res.json({error:err});
      } else {
        res.json(itinerary);
      }
    })
  },
  postItinerary: (req, res) => {
    const newItinerary = new Itinerary({
      user: req.body.user,
      days: req.body.days,
      places: req.body.places,
    })

    newItinerary.save((err, itinerary) => {
      if(err) {
        res.send({error:err})
      } else {
        let mailOptions = {
          from: '"Plan It Now" <planitnow@outlook.com>',
          to: 'anthonyjuan95@gmail.com',
          subject: 'test bro',
          text: 'waddup',
          html: '<h1>Wassup</h1>'
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if(err) {
            return console.log(err);
          } else {
            console.log('email sent!');
            res.send(itinerary);
          }
        })
      }
    })
  },
  updateItinerary: (req, res) => {
    Itinerary.findByIdAndUpdate(req.params.id, {
      user: req.body.user,
      days: req.body.days,
      places: req.body.places,
    }, {new: true},
    (err, updatedItinerary) => {
      if(err) {
        res.send({error:err});
      } else {
        res.send(updatedItinerary);
      }
    })
  },
  deleteItinerary: (req, res) => {
    Itinerary.findByIdAndRemove(req.params.id, (err, deletedItinerary) => {
      if(err) {
        res.send({error:err});
      } else {
        res.send(deletedItinerary);
      }
    })
  }
};
