const { errAddMe } = require('../../utils/errorHandlers'),
      jwt = require('jsonwebtoken'),
      { jwtSecret } = require('../../utils/config');

module.exports = {
  removeMeFromBar: async (root, args, context) => {
    const { bar_id, display_name } = args,
          { mongo: { Bars }, req: { cookies }} = context;

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

    // find record and remove user
    const result = await Bars.findOneAndUpdate(
      { "bar_id": bar_id, "attending": { $elemMatch: { display_name }}},
      { $pull: { "attending": { "display_name": display_name }}},
      { returnOriginal: false }
    ).catch(err => errAddMe(err));
    
    return result.value;
  }
}
