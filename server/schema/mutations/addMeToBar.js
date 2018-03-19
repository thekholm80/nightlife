const { errAddMe, errDBBar } = require('../../utils/errorHandlers'),
      jwt = require('jsonwebtoken'),
      { jwtSecret } = require('../../utils/config');

module.exports = {
  addMeToBar: async (root, args, context) => {
    const { display_name, bar_id } = args;
    const { mongo: { Bars }, req: { cookies }} = context;
    /*
      verify cookie/jwt
    */

    // make sure cookie is present
    if (!cookies.Nightlife) {
      return {"error": "you must be logged in to do that" };
    }

    // verify jwt
    try {
      jwt.verify(cookies.Nightlife, jwtSecret);
    }
    catch (err) {
      // handle invalid jwt
      console.warn(err);
      return {"error": "invalid jwt"};
    }

    // check to see if user is already added to bar
    const checkBar = await Bars.findOne(
      { "bar_id": bar_id, "attending": { $elemMatch: { display_name }}}
    ).catch(err => errDBBar(err));

    // add user if not found
    if (!checkBar) {
      const { value } = await Bars.findOneAndUpdate(
        { "bar_id": bar_id },
        { $push: { "attending": { "display_name": display_name }}},
        { upsert: true, returnOriginal: false }
      ).catch(err => errAddMe(err));

      return value ? value : { "error": "operation failed" };
    }

    return checkBar;
  }
}
