'use strict'

process.env.NODE_ENV = 'test';
const chai = require('chai'),
      chaiHTTP = require('chai-http'),
      // monggo = require('mongoose'),
      should = chai.should(),
      pwh = require('password-hash'),
      User = require('../models/user'),
      server = require('../app')

chai.use(chaiHTTP);


describe('User Testing', () => {
  let currentData;
  beforeEach((done) => {
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

    newUser.save((err,user) => {
      currentData = user;
      const newUser2 = new User({
        name: 'Anthony2',
        email: 'anthony2@juan.com',
        password: '12345',
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

  it('should return token after login', (done) => {
    chai.request(server)
    .post('/login')
    .send({
      email: 'anthony@juan.com',
      password: '12345'
    })
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('token');
      done();
    })
  })

  it('should error if email is not filled when login', (done) => {
    chai.request(server)
    .post('/login')
    .send({
      password: '12345'
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.have.property('error');
      res.body.error.should.equal('user not found');
      done()
    })
  })


  it('should error if password is not filled when login', (done) => {
    chai.request(server)
    .post('/login')
    .send({
      email: 'anthony@juan.com',
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.have.property('error');
      res.body.error.should.equal('wrong password');
      done()

    })
  })

  it('should return token after signup', (done) => {
    chai.request(server)
    .post('/signup')
    .send({
      name: 'astutay',
      email: 'astutay@juan.com',
      password: '12345'
    })
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('token');
      done();
    })
  })


  it('should return error if email already exist', (done) => {
    chai.request(server)
    .post('/signup')
    .send({
      name:'mantab soul',
      email:'anthony@juan.com',
      password: '11111'
    })
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('error')
      done();
    })
  })

  it('should return token after login with fesbuk', (done) => {
    chai.request(server)
    .post('/login-fb')
    .send({
      name: 'astutay',
      email: 'astutay@juan.com'
    })
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('token');
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

  it('should not create new user if name is empty', (done) => {
    chai.request(server)
    .post('/users')
    .send({
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
      res.body.should.have.property('error');
      done();
    })
})

it('should not create new user if email is empty', (done) => {
  chai.request(server)
  .post('/users')
  .send({
    name: 'Anthony juan',
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
    // console.log(res.body);
    res.should.have.status(200);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
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

  it('should not update user if name is empty', (done) => {
    const newUser = new User({
      name: 'Anthon',
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
        name: '',
      })
      .end((err,res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.not.have.property('error');
        res.body.name.should.equal('Anthon');
        done();
      })
    })

  })

  it('shouldnot return user when decode with invalid token', (done) => {
      chai.request(server)
      .get('/users/userdata/')
      .set('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzdGFnYUBqdWFuLmNvbSIsImlhdCI6MTQ5NDkyMjY1N30.WjjjZytcM8vTfuXp-3E3Bk-WworxEC70praWD3oux6c')
      .end((err,res) => {
        console.log(res.body);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('user not found')
        done();
      })

  })


  it('should not update user if email is empty', (done) => {
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
        email: '',
      })
      .end((err,res) => {
        // console.log(res.body);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.not.have.property('error');
        res.body.email.should.equal('anthony777@juan.com');
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

})
