const bcrypt = require('bcryptjs');

// generate salt, use to hash password, return hash
module.exports = async password => {
  const salt = await bcrypt.genSalt(10),
        hash = await bcrypt.hash(password, salt);

  return hash;
}
