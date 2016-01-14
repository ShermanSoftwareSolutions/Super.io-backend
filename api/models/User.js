/**
 * User.js
 *
 * @description :: Represents the end-user of this application.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var jwt = require('jwt-simple');
var moment = require('moment');

module.exports = {
  tableName: 'users',

  attributes: {
    firstName: {
      type: 'string',
      required: true,
      size: 45
    },

    lastName: {
      type: 'string',
      required: true,
      size: 45
    },

    email: {
      type: 'string',
      required: true,
      email: true,
      size: 45
    },

    password: {
      type: 'string',
      required: true,
      size: 64
    }
  },

  createToken: function (user) {
    var payload = {
      sub: user.id,
      iat: moment().unix(),
      exp: moment().add(config.TOKEN_TTL, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
  }
};

