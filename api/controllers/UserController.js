/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcryptjs');

module.exports = {
  /**
   * Logs a user in and returns a JWT
   *
   * @param req
   * @param res
   * @returns {*}
   */
  login: function (req, res) {
    var newUser = {
      email: req.body.email,
      password: req.body.password
    };

    // Check if the email and password are given, otherwise return an error
    if (newUser.email == '' || newUser.password == '')
      return res.status(422).json('Incorrect email or password');

    // Check if the user exists
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

  /**
   * Signs up the user and returns a JWT
   *
   * @param req
   * @param res
   * @returns {*}
   */
  signup: function (req, res) {
    var newUser = {
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    };

    // Check if the input is null
    if (newUser.email == '' || newUser.password == '' || newUser.confirmPassword == '')
      return res.status(422).json('Invalid credentials');

    // Compares the password and confirm password
    if (newUser.password != newUser.confirmPassword)
      return res.status(422).json('Password do not match');

    // Check if the email already exists
    User
      .findOne({email: newUser.email})
      .then(function (user) {
        if (user)
          return res.status(422).json('Email is already taken');

        // Generate a salt and create a hash
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.confirmPassword = undefined;

            // Creates the user in the DB
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
