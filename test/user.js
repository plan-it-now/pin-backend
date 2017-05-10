const chai = require('chai'),
      chaiHTTP = require('chai-http'),
      monggo = require('mongoose'),
      User = require('../models/user'),
      should = chai.should()

chai.use(chaiHTTP);


describe('User Testing', () => {
  beforeEach(function(done) {

    let newUser = new User({
      name: 'anthony',
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

    newUser.save(function(err, user){
      done();
    })

  })

  describe('GET /users', () => {
    it('should return all users', (done) => {
      chai.request('http://localhost:3000')
      .get('/users')
      .end((err,res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.equal(1);
      })
    })
  })

})
