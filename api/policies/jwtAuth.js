var jwt = require('jwt-simple');

module.exports = function (req, res, next) {
  if (!req.headers.authentication) {
    return handleError(res);
  }

  var token = req.headers.authentication.split(' ')[1];

  var payload = jwt.decode(token, config.TOKEN_SECRET);

  if (!payload.sub)
    return handleError(res);

  req.userId = payload.sub.id;

  next();
};

function handleError(res) {
  return res.status(401).json('You are not authorized');
}
