process.env.NODE_ENV = 'test';
const chai = require('chai'),
      chaiHTTP = require('chai-http'),
      // monggo = require('mongoose'),
      should = chai.should(),
      Place = require('../models/place'),
      server = require('../app')

chai.use(chaiHTTP);

describe('Place Testing', () => {
  let currentData;
  beforeEach((done) => {
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
      detail_url: 'detail url'
    })

    newPlace.save((err,user) => {
      currentData = user;
      done()
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
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.should.not.have.property('error');
      res.body.length.should.equal(1);
      done();
    })
  })

  it('should return the new posted user', (done) => {
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
      detail_url: 'detail url'
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

  it('should return deleted place', (done) => {
    chai.request(server)
    .delete('/places/'+currentData._id)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.not.have.property('error');
      res.body.name.should.equal('Hacktiv8');
      done();
    })
  })

  it('should return updated user', (done) => {
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
      detail_url: 'detail url'
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

})
