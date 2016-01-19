/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcryptjs');

module.exports = {
  login: function (req, res) {
    var newUser = {
      email: req.body.email,
      password: req.body.password
    };

    // Check if the email and password are given, otherwise return an error
    if (newUser.email == '' || newUser.password == '')
      return res.status(422).json('Incorrect email or password');

    User
      .findOne({email: newUser.email})
      .then(function (user) {
        if (!user)
          return res.status(422).json('Incorrect email or password');

        // Compare the supplied password from the user with the real password
        bcrypt.compare(newUser.password, user.password, function (err, isMatch) {
          // Check if the passwords are matching
          if (!isMatch || err)
            return res.status(422).json('Incorrect email or password');

          user = user.toObject();
          user.password = undefined;

          // Create a JSON Web Token
          var token = User.createToken(user);

          var response = {
            token: token,
            user: user
          };

          return res.json(response);
        });
      });
  },

  signup: function (req, res) {
    var newUser = {
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    };

    if (newUser.email == '' || newUser.password == '' || newUser.confirmPassword == '')
      return res.status(422).json('Invalid credentials');

    if (newUser.password != newUser.confirmPassword)
      return res.status(422).json('Password do not match');

    User
      .findOne({email: newUser.email})
      .then(function (user) {
        if (user)
          return res.status(422).json('Email is already taken');

        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.confirmPassword = undefined;

            User
              .create(newUser)
              .then(function (user) {
                // Create a JSON Web Token
                var token = User.createToken(user);

                user = user.toObject();
                user.password = undefined;

                var response = {
                  token: token,
                  user: user
                };

                return res.json(response);
              });
          });
        });
      });
  }
};
