const { MongoClient } = require('mongodb'),
      { dbURL } = require('./config'),
      { errDBConnect } = require('./errorHandlers');

// Connect to the database, return context for each collection
module.exports = async () => {
  const client = await MongoClient.connect(dbURL)
                          .catch(err => {
                            errDBConnect(err);
                            process.exit(1);
                          });

  console.log(`Connected to MongoDB`);

  return {
    /*
      I believe I'll create a separate context for each
      collection in the database
    */
    Users: client.db('nightlife').collection('users'),
    Bars: client.db('nightlife').collection('bars')
  }
}
