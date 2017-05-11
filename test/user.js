'use strict'

process.env.NODE_ENV = 'test';
const chai = require('chai'),
      chaiHTTP = require('chai-http'),
      // monggo = require('mongoose'),
      should = chai.should(),
      User = require('../models/user'),
      server = require('../app'),
      pwh = require('password-hash'),
      jwt = require('jsonwebtoken')

chai.use(chaiHTTP);


describe('User Testing', () => {
  let currentData;
  const passUser = '12345';
  beforeEach((done) => {
    const newUser = new User({
      name: 'Anthony',
      email: 'anthony@juan.com',
      password: pwh.generate(passUser),
      pref: {
        history: 50,
        nature: 50,
        architecture: 50,
        shopping: 50,
        art: 50
      }
    })

    newUser.save((err,user) => {
      currentData = user;
      const newUser2 = new User({
        name: 'Anthony2',
        email: 'anthony2@juan.com',
        password: pwh.generate(passUser),
        pref: {
          history: 50,
          nature: 50,
          architecture: 50,
          shopping: 50,
          art: 50
        }
      })

      newUser2.save((err,user) => {
        done();
      })
    })
  })

  afterEach((done) => {
    User.remove({}, (err) => {
      done();
    });
  });

  it('should return all users', (done) => {
    chai.request(server)
    .get('/users')
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.equal(2);
      done();
    })
  })

  it('should return user that have been posted', (done) => {
    chai.request(server)
    .post('/users')
    .send({
      name: 'Anthony juan',
      email: 'anthony666@juan.com',
      password: '12345',
      pref: {
        history: 50,
        nature: 50,
        architecture: 50,
        shopping: 50,
        art: 50
      }
    })
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.not.have.property('error');
      res.body.name.should.equal('Anthony juan');
      res.body.email.should.equal('anthony666@juan.com');
      done();
    })
  })

  it('should return updated user', (done) => {
    const newUser = new User({
      name: 'Anthony Chen',
      email: 'anthony777@juan.com',
      password: '12345',
      pref: {
        history: 50,
        nature: 50,
        architecture: 50,
        shopping: 50,
        art: 50
      }
    })

    newUser.save((err,user) => {
      chai.request(server)
      .put('/users/'+user._id)
      .send({
        name: 'Jackie Chen',
      })
      .end((err,res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.not.have.property('error');
        res.body.name.should.equal('Jackie Chen');
        done();
      })
    })

  })

  it('should return deleted user', (done) => {
    chai.request(server)
    .delete('/users/'+currentData._id)
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.email.should.equal('anthony@juan.com');
      done();
    })

  })

  it('login should return token', (done) => {
    chai.request(server)
    .post('/login')
    .send({
      email: 'anthony@juan.com',
      password: '12345'
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('token');
      done();
    })
  })

  it('login with wrong email should return error', (done) => {
    chai.request(server)
    .post('/login')
    .send({
      email: 'anthony666@juan.com',
      password: '12345'
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      done();
    })
  })

  it('login with wrong password should return error', (done) => {
    chai.request(server)
    .post('/login')
    .send({
      email: 'anthony@juan.com',
      password: '123451111'
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      done();
    })
  })

  it('signup should return token too', (done) => {
    chai.request(server)
    .post('/signup')
    .send({
      name: 'Budianto',
      email: 'budiono@budi.com',
      password: '12345'
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('token');
      done();
    })
  })

  it('signup with same email, should return error', (done) => {
    chai.request(server)
    .post('/signup')
    .send({
      name: 'Budianto',
      email: 'anthony@juan.com',
      password: '12345'
    })
    .end((err, res) => {
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      done();
    })
  })


})
