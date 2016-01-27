/**
 * 422 (Unprocessable Entity) Handler
 *
 * Usage:
 * return res.invalidInput();
 * return res.invalidInput(err);
 *
 * e.g.:
 * ```
 * return res.invalidInput('Password do not match.');
 * ```
 */

module.exports = function invalidInput (data) {
  var res = this.res;

  // Set status code
  res.status(422);

  if (typeof data === 'string') {
    return res.json(data);
  } else {
    return res.json('Invalid input');
  }
};

