'use strict'

const Itinerary = require('../models/itinerary');
const nodemail = require('nodemailer');
require('dotenv').config();

let transporter = nodemail.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    auth: {
      user: 'planitnow@outlook.com',
      pass: process.env.PASSWORD
    },
    tls: {
        ciphers:'SSLv3'
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
    .sort({ createdAt: -1})
    .populate('places.place')
    .exec((err, itineraries) => {
      if(err){
        res.status(400).json({error: err});
      } else {
        res.json(itineraries);
      }
    })
  },
  getItineraryById: (req, res) => {
    Itinerary.findById(req.params.id)
    .populate('places.place')
    .exec((err,itinerary) => {
      if(err) {
        res.json({error:err});
      } else {
        res.json(itinerary);
      }
    })
  },
  postItinerary: (req, res) => {
    const newItinerary = new Itinerary({
      user: req.body.user._id,
      days: req.body.days,
      places: req.body.places,
    })

    newItinerary.save((err, itinerary) => {
      if(err) {
        res.send({error:err})
      } else {
        Itinerary.findOne({_id: itinerary._id})
        .populate('places.place')
        .exec((err, itinerary) => {
          if(err) {
            res.send({error: err})
          } else {
            const orderedPlaces = [];
            let htmlCanggih = '';

            for(let i = 1; i <= itinerary.days; i++) {
              orderedPlaces.push(itinerary.places.filter(place => place.day == i))
            }

            orderedPlaces.map((places,idx) => {
              let trForPlace = '';
              places.map((x,idx) => {
                trForPlace += `
                  <tr>
                    <td>${idx+1}</td>
                    <td>${x.schedule}</td>
                    <td>${x.place.name}</td>
                    <td> <a href=${x.place.details_url}>Detail</a> </td>
                  </tr>
                `
              })
              htmlCanggih += `
                <h1>Day ${idx+1}</h1>
                <table>
                  <tr>
                    <th>No</th>
                    <th>Schedule</th>
                    <th>Place</th>
                    <th>URL</th>
                  </tr>
                  ${trForPlace}
                </table>
              `
            })

            const htmlFinal = `
            <html>
            <head>
            <style>
            table {
              border-collapse: collapse;
              width: 100%;
            }

            th, td {
              text-align: left;
              padding: 8px;
            }

            th {
              background-color: #5E35B1;
              color: white;
            }
            </style>
            </head>
            <body>

            <h1>Hi, ${req.body.user.name}!/h1>
            <h3>Here is your Itinerary for ${itinerary.days} Days Trip To ${orderedPlaces[0][0].place.city}</h3>
            ${htmlCanggih}
            <br>
            <br>

            <h3>Have a nice trip,</h3>
            <br>
            <br>
            <h3><b>Plan It Now Team</b></h3>
            </body>
            </html>
            `
            // PRODUCTION
            let mailOptions = {
              from: '"Plan It Now" <planitnow@outlook.com>',
              to: req.body.user.email,
              subject: 'test bro',
              text: 'waddup',
              html: htmlFinal
            };
            transporter.sendMail(mailOptions, (err, info) => {
              if(err) {
                res.send({error: err})
              } else {
                console.log('email sent!');
                res.send(itinerary);
              }
            })

            // DEVELOPMENT
            // res.send(itinerary);

          }
        })
      }
    })
  },
  updateItinerary: (req, res) => {
    Itinerary.findById(req.params.id, (err,itinerary) => {
      if (err) {
        res.send({error:err})
      } else {
        itinerary.user = req.body.user._id || itinerary.user;
        itinerary.days = req.body.days || itinerary.days;
        itinerary.places = req.body.places || itinerary.places;

        itinerary.save((err, updatedItinerary) => {
          if(err) {
            res.send({error:err});
          } else {
            res.send(updatedItinerary);
          }
        })
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
