'use strict'

process.env.NODE_ENV = 'test';
const chai = require('chai'),
      chaiHTTP = require('chai-http'),
      // monggo = require('mongoose'),
      should = chai.should(),
      User = require('../models/user'),
      Place = require('../models/place'),
      Itinerary = require('../models/itinerary'),
      server = require('../app')

chai.use(chaiHTTP);


describe('Itinerary Testing', () => {
  let currentUser;
  let currentPlace;
  let currentItinerary;
  beforeEach((done) => {
    const newUser = new User({
      name: 'Anthony',
      email: 'anthony@juan.com',
      password: '12345',
      pref: {
        history: 50,
        nature: 50,
        architecture: 50,
        shopping: 50,
        art: 50
      }
    })

    const newPlace = new Place({
      name: 'Water Boom',
      city: 'Bali',
      description: 'A big water park for the family',
      tag: 'nature',
      photo: 'water.jpg',
      loc: {
        latitude: -7.0123,
        longitude: 101.21212
      },
      detail_url: 'www.waterboom.com'
    })

    newUser.save((err,user) => {
      if(err) {
        console.log('newUser err: ',err);
        done();
        return;
      }
      currentUser = user;

      newPlace.save((err2, place) => {
        if(err2){
          console.log('newPlace err: ',err2);
          done();
          return;
        }
        currentPlace = place;

        const newItinerary = new Itinerary({
          user: user._id,
          places: [{
            place: place._id,
            schedule: '09.00-11.00',
            day: 1,
            sequence: 1
          }]
        })
        newItinerary.save((err,itinerary) => {
          currentItinerary = itinerary;
          done();
        })
      })

    })
  })

  afterEach((done) => {
    Itinerary.remove({}, (err) => {
      Place.remove({}, (err) => {
        User.remove({}, (err) => {
          done();
        });
      });
    });
  });

  it('should return all itineraries', (done) => {
    chai.request(server)
    .get('/itineraries')
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.equal(1);
      done();
    })
  })

  it('should return itinerary that have been posted', (done) => {
    chai.request(server)
    .post('/itineraries')
    .send({
      user: currentUser._id,
      places: [{
        place: currentPlace._id,
        schedule: '11.00-12.00',
        day: 1,
        sequence: 2
      }]
    })
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.not.have.property('error');
      res.body.user.toString().should.equal(currentUser._id.toString());
      res.body.places.length.should.equal(1);
      done();
    })
  })

  it('should return updated itinerary', (done) => {
    const newItinerary = new Itinerary({
      user: currentUser._id,
      places: [{
        place: currentPlace._id,
        schedule: '11.00-12.00',
        day: 1,
        sequence: 2
      }]
    })

    newItinerary.save((err,itinerary) => {
      chai.request(server)
      .put('/itineraries/'+itinerary._id)
      .send({
        user: currentUser._id,
        places: [{
          place: currentPlace._id,
          schedule: '12.00-13.00',
          day: 2,
          sequence: 3
        }]
      })
      .end((err,res) => {
        console.log(res.body);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.not.have.property('error');
        res.body.places[0].day.should.equal(2);
        done();
      })
    })

  })

  it('should return deleted itinerary', (done) => {
    chai.request(server)
    .delete('/itineraries/'+currentItinerary._id)
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.user.toString().should.equal(currentUser._id.toString());
      done();
    })

  })

})
