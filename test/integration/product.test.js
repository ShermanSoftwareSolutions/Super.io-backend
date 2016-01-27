var should = require('should');
var assert = require('assert');
var request = require('supertest');
var config = require('../../api/services/config');

var url = config.API_URL;
var jwt = undefined;

describe('Product controller', function () {

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

  describe('POST /product:', function () {
    var endpoint = 'product';

    it ('should result 422 when creating a product without input', function (done) {
      request(url)
        .post(endpoint)
        .send({})
        .set('Authorization', 'Bearer ' + jwt)
        // end handles the response
        .end(function (err, res) {
          if (err) {
            throw err;
          }
          // Status code should match with 422
          res.status.should.equal(422);

          should.exist(res.body);

          done();
        });
    });

    it ('should create a new product when valid input is given', function (done) {
      request(url)
        .post(endpoint)
        .send({
          title: 'Test item 1',
          price: 3.2,
          salesTax: '6'
        })
        .set('Authorization', 'Bearer ' + jwt)
        // end handles the response
        .end(function (err, res) {
          if (err) {
            throw err;
          }
          // Status code should match with 200
          res.status.should.equal(200);

          should.exist(res.body);

          done();
        });
    });
  });

  describe('GET /product:', function () {
    var endpoint = 'product';

    it('should return an array with one item', function (done) {
      request(url)
        .get(endpoint)
        .set('Authorization', 'Bearer ' + jwt)
        // end handles the response
        .end(function (err, res) {
          if (err) {
            throw err;
          }
          // Status code should match with 200
          res.status.should.equal(200);

          should.exist(res.body);

          (res.body.length).should.equal(1);

          done();
        });
    });
  });

});
