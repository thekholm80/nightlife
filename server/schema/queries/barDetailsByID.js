const yelp = require('yelp-fusion'),
      { yelpID, yelpSecret, yelpKey } = require('../../utils/config'),
      { errYelp, errDBBar } = require('../../utils/errorHandlers');

module.exports = {
  barDetailsByID: async (root, { id }, { mongo: { Bars }}) => {
    try {
      // make yelp api call
      // old yelp OAuth2
      // const response = await yelp.accessToken(yelpID, yelpSecret),
      //       client = await yelp.client(response.jsonBody.access_token),
      //       { jsonBody } = await client.business(id);

      // new yelp auth
      const client = await yelp.client(yelpKey),
            { jsonBody } = await client.business(id);

      // query database to see if anyone has checked in to this bar
      const rollCall = await Bars.findOne({ bar_id: jsonBody.id })
                                 .catch(err => errDBBar(err));

      // append db query results to api call results
      jsonBody["attendees"] = rollCall ? rollCall.attending : [];

      return jsonBody;
    }

    catch(err) {
      errYelp(err);
      return { "error": "Yelp API call failed" };
    }
  }
}

/*
  the arguments are (root, arguments, context), i'm destructuring off these

  using a try/catch block to reduce error handling yuck in yelp calls
*/
