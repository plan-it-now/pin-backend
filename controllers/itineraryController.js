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

            tr:nth-child(even){background-color: #f2f2f2}

            th {
              background-color: #5E35B1;
              color: white;
            }
            </style>
            </head>
            <body>

            <h2>Plan It Now ! Trip To ${orderedPlaces[0][0].place.city}</h2>
            ${htmlCanggih}
            </body>
            </html>
            `

            let mailOptions = {
              from: '"Plan It Now" <anthonyjuanchristian@gmail.com>',
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
          }
        })
      }
    })
  },
  updateItinerary: (req, res) => {
    Itinerary.findByIdAndUpdate(req.params.id, {
      user: req.body.user._id,
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
