const yelp = require('yelp-fusion'),
      { yelpID, yelpSecret, yelpKey } = require('../../utils/config'),
      { errDBBar, errYelp } = require('../../utils/errorHandlers');

module.exports = {
  barListByLocation: async (root, { loc }, { mongo: { Bars }}) => {
    try {
      // make yelp api call old yelp OAuth 2
      // const response = await yelp.accessToken(yelpID, yelpSecret),
      //       client = await yelp.client(response.jsonBody.access_token),
      //       { jsonBody: { businesses }} = await client.search({
      //         term: 'bar',
      //         location: loc,
      //         radius: 40000,
      //         limit: 20
      //       });

      // new yelp auth
      const client = await yelp.client(yelpKey),
              { jsonBody: { businesses }} = await client.search({
                term: 'bar',
                location: loc,
                radius: 40000,
                limit: 20
              });

      // query db to get attending count
      const results = businesses.map(async barResult => {
        const bar = await Bars.findOne({ "bar_id": barResult.id })
                                .catch(err => errDBBar(err));
        // append db query results to api results
        barResult["attending_count"] = bar ? bar.attending.length : 0;

        return barResult;
      });

      return results;
    }

    catch(err) {
      errYelp(err);
      return { "error": "Yelp API call failed" };
    }
  }
}

/*
  everything is in a try/catch block to simplify yelp api error handling
*/
