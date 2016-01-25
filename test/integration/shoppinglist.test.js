var should = require('should');
var assert = require('assert');
var request = require('supertest');
var config = require('../../api/services/config');

var url = config.API_URL;
var jwt = undefined;

describe('Shoppinglist/cart controller', function () {

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

  describe('POST /shoppinglist:', function () {
    var endpoint = 'shoppinglist';

    it ('should give a 422 when given no shoppinglist title', function (done) {
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

    it ('should create a shoppinglist given a title', function (done) {
      request(url)
        .post(endpoint)
        .send({title: 'Test'})
        .set('Authorization', 'Bearer ' + jwt)
        // end handles the response
        .end(function (err, res) {
          if (err) {
            throw err;
          }
          // Status code should match with 200
          res.status.should.equal(200);

          should.exist(res.body);

          Shoppinglist
            .find()
            .then(function (items) {
              items.length.should.equal(1);
            });

          done();
        });
    });
  });

  describe('GET /shoppinglist:', function () {
    var endpoint = 'shoppinglist';

    it('should return exactly one shoppinglist', function (done) {
      request(url)
        .get(endpoint)
        .send({})
        .set('Authorization', 'Bearer ' + jwt)
        // end handles the response
        .end(function (err, res) {
          if (err) {
            throw err;
          }
          // Status code should match with 200
          res.status.should.equal(200);

          should.exist(res.body);

          res.body.length.should.equal(1);

          done();
        });
    });

  });


  describe('PUT /shoppinglist/:listId/:productId:', function () {
    var endpoint = 'shoppinglist';

    it('should not add a product to the shoppinglist when given wrong input', function (done) {
      request(url)
        .put(endpoint + '/' + 1337 + '/' +  1337)
        .send({amount: 2})
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

    it('should add a product to the shoppinglist', function (done) {
      Product.find().then(function(items) {
        var productId = items[0].id;
        Shoppinglist.find().then(function(items) {
          var listId = items[0].id;
          request(url)
            .put(endpoint + '/' + productId + '/' + listId)
            .send({amount: 2})
            .set('Authorization', 'Bearer ' + jwt)
            // end handles the response
            .end(function (err, res) {
              if (err) {
                throw err;
              }

              // Status code should match with 200
              res.status.should.equal(200);

              should.exist(res.body);

              res.body.amount.should.equal(2);

              done();
            });
        });
      });
    });

  });

  describe('POST /shoppingcart:', function () {
    var endpoint = 'shoppingcart';

    it('should create a shoppingcart given a shoppinglist', function (done) {
      Shoppinglist.find().then(function(items) {
        var shoppinglistId = items[0].id;
        request(url)
          .post(endpoint)
          .send({shoppinglistId: shoppinglistId})
          .set('Authorization', 'Bearer ' + jwt)
          // end handles the response
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            // Status code should match with 200
            res.status.should.equal(200);

            should.exist(res.body);

            should.exist(res.body.lines);

            res.body.lines.length.should.equal(1);
            res.body.lines[0].amount.should.equal(2);
            res.body.lines[0].scanned.should.equal(false);

            done();
          });
      });
    });

    it('should scan a product from a shopping list', function (done) {
      Product.find().then(function (items) {
        var productId = items[0].id;

        Shoppingcart.find().then(function (items) {
          var shoppingcartId = items[0].id;
          request(url)
            .put(endpoint)
            .send({shoppingcartId: shoppingcartId, productId: productId})
            .set('Authorization', 'Bearer ' + jwt)
            // end handles the response
            .end(function (err, res) {
              if (err) {
                throw err;
              }

              res.body = res.body[0];
              // Status code should match with 200
              res.status.should.equal(200);

              should.exist(res.body.amount);
              should.exist(res.body.scanned);

              res.body.amount.should.equal(2);
              res.body.scanned.should.equal(true);

              done();
            });
        });
      });
    });
  });
});
