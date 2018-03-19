require('dotenv').config();

const PORT = process.env.PORT || 3000,
      DB_URL = process.env.DB_URL,
      YELP_ID = process.env.YELP_ID,
      YELP_SECRET = process.env.YELP_SECRET,
      YELP_KEY = process.env.YELP_KEY,
      JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  port: PORT,
  dbURL: DB_URL,
  yelpID: YELP_ID,
  yelpSecret: YELP_SECRET,
  yelpKey: YELP_KEY,
  jwtSecret: JWT_SECRET
}
