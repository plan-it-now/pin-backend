process.env.NODE_ENV = 'test';
const chai = require('chai'),
      chaiHTTP = require('chai-http'),
      // monggo = require('mongoose'),
      should = chai.should(),
      Place = require('../models/place'),
      User = require('../models/user'),
      server = require('../app'),
      pwh = require('password-hash'),
      jwt = require('jsonwebtoken');

chai.use(chaiHTTP);

describe('Place Testing', () => {
  let currentData;
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
    newUser.save((err,user) => {

      const newPlace = new Place({
        name: 'Hacktiv8',
        city: 'Jakarta Selatan',
        description: 'sebuah tempat wisata yang permai',
        tag: 'Art',
        photo: 'foto gedung hacktiv',
        loc: {
          latitude: 6,
          longitude: 101
        },
        details_url: 'detail url'
      })

      newPlace.save((err,place) => {
        currentData = place;
        done()
      })

    })

  })

  afterEach((done) => {
    Place.remove({}, (err) => {
      done();
    });
  });

  it('should return all places', (done) => {
    chai.request(server)
    .get('/places')
    .set('token', token)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.should.not.have.property('error');
      res.body.length.should.equal(1);
      done();
    })
  })

  it('should not return all places if no token was defined', (done) => {
    chai.request(server)
    .get('/places')
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.have.property('error');
      res.body.error.name.should.equal('JsonWebTokenError');
      res.body.error.message.should.equal('jwt must be provided');
      done();
    })
  })

  it('should return the new posted place', (done) => {
    chai.request(server)
    .post('/places')
    .set('token', token)
    .send({
      name: 'Hacktiv888',
      city: 'Jakarta Selatan',
      description: 'sebuah tempat wisata yang permai',
      tag: 'Art',
      photo: 'foto gedung hacktiv',
      latitude: 6,
      longitude: 101,
      details_url: 'detail url'
    })
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.not.have.property('error');
      res.body.name.should.equal('Hacktiv888');
      res.body.loc.longitude.should.equal(101);
      done();
    })
  })

  it('should not create new place if no token was defined', (done) => {
    chai.request(server)
    .post('/places')
    .send({
      name: 'Hacktiv888',
      city: 'Jakarta Selatan',
      description: 'sebuah tempat wisata yang permai',
      tag: 'Art',
      photo: 'foto gedung hacktiv',
      latitude: 6,
      longitude: 101,
      details_url: 'detail url'
    })
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.have.property('error');
      res.body.error.name.should.equal('JsonWebTokenError');
      res.body.error.message.should.equal('jwt must be provided');
      done();
    })
  })


  it('should not create new place with no name defined', (done) => {
    chai.request(server)
    .post('/places')
    .set('token', token)
    .send({
      city: 'Jakarta Selatan',
      description: 'sebuah tempat wisata yang permai',
      tag: 'Art',
      photo: 'foto gedung hacktiv',
      latitude: 6,
      longitude: 101,
      details_url: 'detail url'
    })
    .end((err,res) => {

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      done();
    })
  })
  it('should not create new place with no city defined', (done) => {
    chai.request(server)
    .post('/places')
    .set('token', token)
    .send({
      name: 'Jakarta Selatan',
      description: 'sebuah tempat wisata yang permai',
      tag: 'Art',
      photo: 'foto gedung hacktiv',
      latitude: 6,
      longitude: 101,
      details_url: 'detail url'
    })
    .end((err,res) => {

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      done();
    })
  })

  it('should not create new place with no description defined', (done) => {
    chai.request(server)
    .post('/places')
    .set('token', token)
    .send({
      name: 'Jakarta Selatan',
      city: 'Jakpus',
      tag: 'Art',
      photo: 'foto gedung hacktiv',
      latitude: 6,
      longitude: 101,
      details_url: 'detail url'
    })
    .end((err,res) => {

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      done();
    })
  })

  it('should not create new place with no tag defined', (done) => {
    chai.request(server)
    .post('/places')
    .set('token', token)
    .send({
      name: 'Jakarta Selatan',
      city: 'Jakpus',
      description: 'Art',
      photo: 'foto gedung hacktiv',
      latitude: 6,
      longitude: 101,
      details_url: 'detail url'
    })
    .end((err,res) => {

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      done();
    })
  })

  it('should not create new place with no photo defined', (done) => {
    chai.request(server)
    .post('/places')
    .set('token', token)
    .send({
      name: 'Jakarta Selatan',
      city: 'Jakpus',
      description: 'Art',
      tag: 'foto gedung hacktiv',
      latitude: 6,
      longitude: 101,
      details_url: 'detail url'
    })
    .end((err,res) => {

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      done();
    })
  })

  it('should not create new place with no details_url defined', (done) => {
    chai.request(server)
    .post('/places')
    .set('token', token)
    .send({
      name: 'Jakarta Selatan',
      city: 'Jakpus',
      description: 'Art',
      tag: 'foto gedung hacktiv',
      latitude: 6,
      longitude: 101,
      photo: 'detail url'
    })
    .end((err,res) => {

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      done();
    })
  })



  it('should return deleted place', (done) => {
    chai.request(server)
    .delete('/places/'+currentData._id)
    .set('token', token)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.not.have.property('error');
      res.body.name.should.equal('Hacktiv8');
      done();
    })
  })

  it('should not delete place if no token was defined', (done) => {
    chai.request(server)
    .delete('/places/'+currentData._id)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.have.property('error');
      res.body.error.name.should.equal('JsonWebTokenError');
      res.body.error.message.should.equal('jwt must be provided');
      done();
    })
  })

  it('should return updated place', (done) => {
    chai.request(server)
    .put('/places/'+currentData._id)
    .set('token', token)
    .send({
      name: 'Hacktiv666',
      city: 'Jakarta Selatan',
      description: 'sebuah tempat wisata yang permai',
      tag: 'Art',
      photo: 'foto gedung hacktiv',
      latitude: 6,
      longitude: 101,
      details_url: 'detail url'
    })
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.not.have.property('error');
      res.body.name.should.equal('Hacktiv666');
      res.body.city.should.equal('Jakarta Selatan');
      done();
    })
  })

  it('should not update place if no token was defined', (done) => {
    chai.request(server)
    .put('/places/'+currentData._id)
    .send({
      name: 'Hacktiv666',
      city: 'Jakarta Selatan',
      description: 'sebuah tempat wisata yang permai',
      tag: 'Art',
      photo: 'foto gedung hacktiv',
      latitude: 6,
      longitude: 101,
      details_url: 'detail url'
    })
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.have.property('error');
      res.body.error.name.should.equal('JsonWebTokenError');
      res.body.error.message.should.equal('jwt must be provided');
      done();
    })
  })


  it('should not updated place if name is empty', (done)  => {
    chai.request(server)
    .put('/places/'+currentData._id)
    .set('token', token)
    .send({
      name: '',
      city: 'Jakarta Selatan',
      description: 'sebuah tempat wisata yang permai',
      tag: 'Art',
      photo: 'foto gedung hacktiv',
      latitude: 6,
      longitude: 101,
      details_url: 'detail url'
    })
    .end((err,res) => {

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.name.should.equal('Hacktiv8');
      done();
    })
  })

    it('should not updated place if city is empty', (done)  => {
      chai.request(server)
      .put('/places/'+currentData._id)
      .set('token', token)
      .send({
        name: 'Hacktiv8',
        city: '',
        description: 'sebuah tempat wisata yang permai',
        tag: 'Art',
        photo: 'foto gedung hacktiv',
        latitude: 6,
        longitude: 101,
        details_url: 'detail url'
      })
      .end((err,res) => {

        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.city.should.equal('Jakarta Selatan');
        done();
      })
    })

    it('should not updated place if description is empty', (done)  => {
      chai.request(server)
      .put('/places/'+currentData._id)
      .set('token', token)
      .send({
        name: 'Hacktiv8',
        city: 'Jakarta Selatan',
        description: '',
        tag: 'Art',
        photo: 'foto gedung hacktiv',
        latitude: 6,
        longitude: 101,
        details_url: 'detail url'
      })
      .end((err,res) => {

        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.description.should.equal('sebuah tempat wisata yang permai');
        done();
      })
    })

    it('should not updated place if tag is empty', (done)  => {
      chai.request(server)
      .put('/places/'+currentData._id)
      .set('token', token)
      .send({
        name: 'Hacktiv8',
        city: 'Jakarta Selatan',
        description: 'sebuah tempat wisata yang permai',
        tag: '',
        photo: 'foto gedung hacktiv',
        latitude: 6,
        longitude: 101,
        details_url: 'detail url'
      })
      .end((err,res) => {

        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.tag.should.equal('Art');
        done();
      })
    })

    it('should not updated place if photo is empty', (done)  => {
      chai.request(server)
      .put('/places/'+currentData._id)
      .set('token', token)
      .send({
        name: 'Hacktiv8',
        city: 'Jakarta Selatan',
        description: 'sebuah tempat wisata yang permai',
        tag: 'Art',
        photo: '',
        latitude: 6,
        longitude: 101,
        details_url: 'detail url'
      })
      .end((err,res) => {

        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.photo.should.equal('foto gedung hacktiv');
        done();
      })
    })

    it('should not updated place if latitude is empty', (done)  => {
      chai.request(server)
      .put('/places/'+currentData._id)
      .set('token', token)
      .send({
        name: 'Hacktiv8',
        city: 'Jakarta Selatan',
        description: 'sebuah tempat wisata yang permai',
        tag: 'Art',
        photo: 'foto gedung hacktiv',
        longitude: 101,
        details_url: 'detail url'
      })
      .end((err,res) => {

        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.loc.latitude.should.equal(6);
        done();
      })
    })

    it('should not updated place if longitude is empty', (done)  => {
      chai.request(server)
      .put('/places/'+currentData._id)
      .set('token', token)
      .send({
        name: 'Hacktiv8',
        city: 'Jakarta Selatan',
        description: 'sebuah tempat wisata yang permai',
        tag: 'Art',
        photo: 'foto gedung hacktiv',
        latitude: 6,
        details_url: 'detail url'
      })
      .end((err,res) => {

        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.loc.longitude.should.equal(101);
        done();
      })
    })

    it('should not updated place if details_url is empty', (done)  => {
      chai.request(server)
      .put('/places/'+currentData._id)
      .set('token', token)
      .send({
        name: 'Hacktiv8',
        city: 'Jakarta Selatan',
        description: 'sebuah tempat wisata yang permai',
        tag: 'Art',
        photo: 'foto gedung hacktiv',
        latitude: 6,
        longitude: 101,
        details_url: ''
      })
      .end((err,res) => {

        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.details_url.should.equal('detail url');
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
