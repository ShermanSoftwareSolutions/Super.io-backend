/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcrypt');

module.exports = {
  login: function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    // Check if the email and password are given, otherwise return an error
    if (email == '' || password == '')
      return res.status(422).json('Incorrect email or password');

    User
      .findOne({email: email})
      .then(function (user) {
        if (!user)
          return res.status(422).json('Incorrect email or password');

        // Compare the supplied password from the user with the real password
        bcrypt.compare(password, user.password, function (err, isMatch) {
          // Check if the passwords are matching
          if (!isMatch || err)
            return res.status(422).json('Incorrect email or password');

          user['password'] = '';

          // Create a JSON Web Token
          var token = User.createToken(user);

          var successfulResponse = {
            token: token,
            user: user
          };

          return res.json(successfulResponse);
        });
      });
  },

  signup: function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;

    if (email == '' || password == '' || confirmPassword == '')
      return res.status(422).json('Invalid credentials');

    if (password != confirmPassword)
      return res.status(422).json('Password do not match');

    User
      .findOne({email: email})
      .then(function (user) {
        console.log(user);
        if (user)
          return res.status(422).json('Email is already taken');

        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            var user = {
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: hash
            };

            User
              .create(user)
              .then(function (user) {
                // Create a JSON Web Token
                var token = User.createToken(user);

                var successfulResponse = {
                  token: token,
                  user: {
                    id: user.id,
                    email: user.email
                  }
                };

                return res.json(successfulResponse);
              });
          });
        });
      });
  }
};
