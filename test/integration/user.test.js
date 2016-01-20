var should = require('should');
var assert = require('assert');
var request = require('supertest');
var config = require('../..//api/services/config');

var url = config.API_URL;
var jwt = undefined;

describe('Login controller', function () {

  describe('POST /user/signup:', function () {
    var endpoint = 'user/signup';

    it('should return 422 trying to signup without input', function (done) {
      request(url)
        .post(endpoint)
        .send({})
        .end(function (err, res) {
          if (err) {
            throw err;
          }

          // Status code should match with 422 (Unprocessable Entity)
          res.status.should.equal(422);

          done();
        });
    });

    it('should return 422 trying to signup with non matching passwords', function (done) {
      request(url)
        .post(endpoint)
        .send({
          firstName: 'Test',
          lastName: 'Tester',
          email: 'test@test.com',
          password: 'test',
          confirmPassword: 'test1'
        })
        .end(function (err, res) {
          if (err) {
            throw err;
          }

          // Status code should match with 422 (Unprocessable Entity)
          res.status.should.equal(422);

          done();
        });
    });

    it('should make an user when correct information is supplied', function (done) {
      request(url)
        .post(endpoint)
        .send({
          firstName: 'Test',
          lastName: 'Tester',
          email: 'test@test.com',
          password: 'test',
          confirmPassword: 'test'
        })
        .end(function (err, res) {
          if (err) {
            throw err;
          }

          jwt = res.body.token;

          // Status code should match with 200
          res.status.should.equal(200);

          User
            .findOne({email: 'test@test.com'})
            .then(function (user) {
              if (!user)
                throw err;
            });

          done();
        });
    });
  });

  describe('POST /user/login:', function () {
    var endpoint = 'user/login';

    it('should return 422 trying to login without input', function (done) {
      request(url)
        .post(endpoint)
        .send({})
        .end(function (err, res) {
          if (err) {
            throw err;
          }

          // Status code should match with 422 (Unprocessable Entity)
          res.status.should.equal(422);

          done();
        });
    });

    it('should return 422 trying to login with wrong password', function (done) {
      request(url)
        .post(endpoint)
        .send({
          email: 'test@test.com',
          password: 'test1'
        })
        .end(function (err, res) {
          if (err) {
            throw err;
          }

          // Status code should match with 422 (Unprocessable Entity)
          res.status.should.equal(422);

          done();
        });
    });

    it('should login with token with valid credentials', function (done) {
      request(url)
        .post(endpoint)
        .send({
          email: 'test@test.com',
          password: 'test'
        })
        .end(function (err, res) {
          if (err) {
            throw err;
          }

          // Status code should match with 200
          res.status.should.equal(200);

          should.exist(res.body.token);
          should.exist(res.body.user);

          done();
        });
    });
  });
});
