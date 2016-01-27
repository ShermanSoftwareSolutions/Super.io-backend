var jwt = require('jwt-simple');

/**
 * Middleware for the JWT authentication
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports = function (req, res, next) {
  // Check if the Authorization header is set
  if (!req.headers.authorization) {
    return handleError(res);
  }

  // Split the Bearer prefix from the token
  var token = req.headers.authorization.split(' ')[1];

  // Decode the JWT with the token secret
  var payload = jwt.decode(token, config.TOKEN_SECRET);

  if (!payload.sub)
    return handleError(res);

  // Append the req object with the current user id
  req.userId = payload.sub.id;

  next();
};

function handleError(res) {
  return res.status(401).json('You are not authorized');
}
