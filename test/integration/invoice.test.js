/**
 * Created by Sander on 25-1-2016.
 */
var should = require('should');
var assert = require('assert');
var request = require('supertest');
var config = require('../../api/services/config');

var url = config.API_URL;
var jwt = undefined;

describe('Invoice controller', function () {

  before(function (done) {
    var endpoint = 'user/login';

    var user = {
      email: 'test@test.com',
      password: 'test'
    };

    request(url)
      .post(endpoint)
      .send(user)
      // end handles the response
      .end(function (err, res) {
        if (err) {
          throw err;
        }

        jwt = res.body.token;

        done();
      });
  });

  describe('POST /invoice:', function () {
    var endpoint = 'invoice';

    it('Should result in a 404 when trying to create an invoice without a shoppingcartid', function (done) {
      request(url)
        .post(endpoint)
        .send({})
        .set('Authorization', 'Bearer ' + jwt)
        // end handles the response
        .end(function (err, res) {
          if (err) {
            throw err;
          }
          // Status code should match with 404
          res.status.should.equal(404);

          should.exist(res.body);

          done();
        });
    })
  });

});
