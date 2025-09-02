const bc = require("bcryptjs");

module.exports = async function crypto(password) {
  const salt = bc.genSaltSync(10);
  const hashPassword = await bc.hash(password, salt);
  return hashPassword;
};
