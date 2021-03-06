'use strict'

process.env.NODE_ENV = 'test';
const chai = require('chai'),
      chaiHTTP = require('chai-http'),
      // monggo = require('mongoose'),
      should = chai.should(),
      User = require('../models/user'),
      Place = require('../models/place'),
      Itinerary = require('../models/itinerary'),
      server = require('../app'),
      pwh = require('password-hash'),
      jwt = require('jsonwebtoken');

chai.use(chaiHTTP);


describe('Itinerary Testing', () => {
  let currentUser;
  let currentPlace;
  let currentItinerary;
  let token;
  beforeEach((done) => {
    //token dummy for testing
    token = generateTokenDummy();
    const newUser = new User({
      name: 'Anthony',
      email: 'anthony@juan.com',
      password: pwh.generate('12345'),
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
      details_url: 'www.waterboom.com'
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
          days: 2,
          places: [{
            place: place._id,
            schedule: '09.00',
            day: 1,
            orderIndex: 1
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
    .set('token', token)
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.equal(1);
      done();
    })
  })

  it('should not return all itineraries if no token was defined', (done) => {
    chai.request(server)
    .get('/itineraries')
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.have.property('error');
      res.body.error.name.should.equal('JsonWebTokenError');
      res.body.error.message.should.equal('jwt must be provided');
      done();
    })
  })


  it('should return all itineraries user', (done) => {
    chai.request(server)
    .get('/itineraries/user/'+currentUser._id)
    .set('token', token)
    .end((err,res) => {
      // console.log('===',res.body[0].places[0].place);
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.equal(1);
      done();
    })
  })

  it('should not return all itineraries by user if no token was defined', (done) => {
    chai.request(server)
    .get('/itineraries/user/'+currentUser._id)
    .end((err,res) => {
      // console.log('===',res.body[0].places[0].place);
      res.should.have.status(200);
      res.body.should.have.property('error');
      res.body.error.name.should.equal('JsonWebTokenError');
      res.body.error.message.should.equal('jwt must be provided');
      done();
    })
  })


  // it('should return itinerary that have been posted and send email', function(done) {
  //   this.timeout(10000);
  //   chai.request(server)
  //   .post('/itineraries')
  //   .send({
  //     user: currentUser,
  //     days: 2,
  //     places: [{
  //       place: currentPlace._id,
  //       schedule: '11.00-12.00',
  //       day: 1,
  //       sequence: 2
  //     }]
  //   })
  //   .end((err,res) => {
  //     res.should.have.status(200);
  //     res.body.should.be.a('object');
  //     res.body.should.not.have.property('error');
  //     res.body.user.toString().should.equal(currentUser._id.toString());
  //     res.body.places.length.should.equal(1);
  //     done();
  //   })
  // })

  it('should return updated itinerary', (done) => {
    const newItinerary = new Itinerary({
      user: currentUser._id,
      days: 2,
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
      .set('token', token)
      .send({
        user: currentUser,
        days: 2,
        places: [{
          place: currentPlace._id,
          schedule: '12.00-13.00',
          day: 2,
          sequence: 3
        }]
      })
      .end((err,res) => {
        // console.log(res.body);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.not.have.property('error');
        res.body.places[0].day.should.equal(2);
        done();
      })
    })

  })

  it('should not update itinerary if no token was defined', (done) => {
    const newItinerary = new Itinerary({
      user: currentUser._id,
      days: 2,
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
        user: currentUser,
        days: 2,
        places: [{
          place: currentPlace._id,
          schedule: '12.00-13.00',
          day: 2,
          sequence: 3
        }]
      })
      .end((err,res) => {
        // console.log(res.body);
        res.should.have.status(200);
        res.body.should.have.property('error');
        res.body.error.name.should.equal('JsonWebTokenError');
        res.body.error.message.should.equal('jwt must be provided');
        done();
      })
    })
  })


  it('should not update itinerary if user is not filled', (done) => {
    const newItinerary = new Itinerary({
      user: currentUser._id,
      days: 2,
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
      .set('token', token)
      .send({
        user: '',
        days: 2,
        places: [{
          place: currentPlace._id,
          schedule: '12.00-13.00',
          day: 2,
          sequence: 3
        }]
      })
      .end((err,res) => {
        // console.log(res.body);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.not.have.property('error');
        res.body.user.should.equal(currentUser._id.toString());
        done();
      })
    })

  })

  it('should not update itinerary if days is not filled', (done) => {
    const newItinerary = new Itinerary({
      user: currentUser._id,
      days: 2,
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
      .set('token', token)
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
        // console.log(res.body);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.not.have.property('error');
        res.body.days.should.equal(2);
        done();
      })
    })

  })

  it('should not update itinerary if places is not filled', (done) => {
    const newItinerary = new Itinerary({
      user: currentUser._id,
      days: 2,
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
      .set('token', token)
      .send({
        user: currentUser._id,
        days: 2
      })
      .end((err,res) => {
        // console.log(res.body);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.not.have.property('error');
        res.body.places[0].day.should.equal(1);
        done();
      })
    })

  })

  it('should return deleted itinerary', (done) => {
    chai.request(server)
    .delete('/itineraries/'+currentItinerary._id)
    .set('token', token)
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.user.toString().should.equal(currentUser._id.toString());
      done();
    })

  })

  it('should note delete itinerary if no token was defined', (done) => {
    chai.request(server)
    .delete('/itineraries/'+currentItinerary._id)
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.have.property('error');
      res.body.error.name.should.equal('JsonWebTokenError');
      res.body.error.message.should.equal('jwt must be provided');
      done();
    })

  })


  function generateTokenDummy(){
    return jwt.sign({
      name: 'Anthony',
      email: 'anthony@juan.com'
    }, process.env.SECRET_KEY);
  }

})
