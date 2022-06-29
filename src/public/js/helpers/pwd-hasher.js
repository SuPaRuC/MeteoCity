const crypto = require('crypto');

module.exports.hashPwd = (password) => {
  const sha256hash = crypto.createHash('sha512');
  const hashedPassword = sha256hash.update(password).digest('base64');
  return hashedPassword;
}