var should = require('should');
var assert = require('assert');
var request = require('supertest');
var config = require('../..//api/services/config');

var url = config.API_URL;

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

  });

});
