module.exports = {
  // server.js
    // mongo = await connectMongo()

  errMongoConnect: err => console.warn(
    "Error connecting to DB", err
  ),

    // app.post('/auth/login', ...)

  errLoginFind: err => console.warn(
    "Error in /auth/login db find", err
  ),
  errPassMatch: err => console.warn(
    "Error in /auth/login verifyPassword", err
  ),

    // app.post('/auth/register', ...)

  errNameCheck: err => console.warn(
    "Error in /auth/register isNameTaken", err
  ),
  errBCrypt: err => console.warn(
    "Error in /auth/register bcrypt()", err
  ),
  errUserAdd: err => console.warn(
    "Error in /auth/register Users.insert()", err
  ),

  // ./utils/mongo-connector

  errDBConnect: err => console.error(
    "Error in MongoClient.connect()", err
  ),

  // ./queries

  errYelp: err => console.error(
    "Yelp API call failed", err
  ),
  errDBBar: err => console.error(
    "Error in Bars.findOne()", err
  ),

  // ./mutations

  errAddMe: err => console.error(
    "Error in Bars.findOneAndUpdate()", err
  ),
}
