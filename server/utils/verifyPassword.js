const bcrypt = require('bcryptjs');

/*
  This should compare the stored hash from the database to the
  password input by the user and return true/false if they match
*/
module.exports = async (userPassword, hashedPassword) => {
  const result = await bcrypt.compare(userPassword, hashedPassword);

  return result;
}
