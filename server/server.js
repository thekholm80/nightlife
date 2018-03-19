const express = require('express'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      jwt = require('jsonwebtoken'),
      { graphqlExpress, graphiqlExpress } = require('apollo-server-express'),
      schema = require('./schema'),
      connectMongo = require('./utils/mongo-connector'),
      { port } = require('./utils/config');

const start = async () => {
  const { errMongoConnect } = require('./utils/errorHandlers'),
        mongo = await connectMongo().catch(err => errMongoConnect(err)),
        app = express();

  // parse cookies into req.cookies
  app.use(cookieParser());

  // set remainder of middleware and configuration
  app.set('port', port);
  app.use(express.static(__dirname + '/public'));

  /*
    enable cors for development

    I'm going to try using a proxy in the package.json when I build
    the front end to see if I can avoid cors in the future
  */

  // app.use((req, res, next) => {
  //   res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  //   res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, Options");
  //   res.header("Access-Control-Allow-Credentials", "true");
  //   next();
  // });

  /*
    give access to bodyparser for
    requests, define api route for graphql requests,
    set mongo connection in context object

    it appears I can create a more complex context here, it's
    simply an object which for now contains my db connection

    might want to expose the req object in context to check
    authorization in queries
  */

  app.use(bodyParser.text({ type: 'application/graphql' }));

  const corsOptions = {
    origin: "http://localhost:8080"
  }

  //cors(corsOptions), removed for production

  app.use('/api', bodyParser.json(), graphqlExpress(req => ({
      context: { mongo, req },
      schema
    })));

  /*
    define graphiql route, point it at /api endpoint for development only

    setting cookie here for testing, all of this should be removed
    in production


  app.use('/dev/graphiql', graphiqlExpress({
    endpointURL: '/api'
  }))

  app.use('/graphiql', async (req, res) => {
    const { jwtSecret } = require('./utils/config');

    const user = {
      display_name: 'lumpy',
      first_name: 'lenny',
      last_name: 'guy',
      password: 'thisIsAHashedString'
    };

    // create tokens
    const cookieToken = await jwt.sign(user, jwtSecret, { expiresIn: "14d" });

    // create expiration date for cookie (ms * s * m * h * d)
    const expDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 12);

    // set token in cookie, cookie in header
    res.cookie("Nightlife", cookieToken, { httpOnly: true, expires: expDate });

    res.redirect('/dev/graphiql');
  });
  */

  /*
    auth route - register
  */

  app.post('/auth/register', bodyParser.json(), async (req, res) => {
    const { display_name, password, first_name, last_name } = req.body,
          { Users } = mongo,
          bcrypt = require('./utils/bcrypt'),
          { errNameCheck, errUserAdd } = require('./utils/errorHandlers');

    // check to see if display_name is in use
    const isNameTaken = await Users.findOne({ display_name: display_name })
                                   .catch(err => errNameCheck(err));

    if (isNameTaken) {
      res.send({ "error": `User name "${ display_name }" is taken` });
      return;
    }

    // hash password
    const hash = await bcrypt(password).catch(err => errBCrypt(err));

    // insert user into database
    const user = await Users.insertOne({
      "display_name": display_name,
      "password": hash,
      "first_name": first_name,
      "last_name": last_name
    }).catch(err => errUserAdd(err));

    // build response
    const response = (user.result.ok === 1)
      ? { "success": "user created"}
      : { "error": "something went wrong" };

    res.send(response);
  });

  /*
    auth route - login
  */

  app.post('/auth/login', bodyParser.json(), async (req, res) => {
    const verifyPassword = require('./utils/verifyPassword'),
          { jwtSecret } = require('./utils/config'),
          { errLoginFind, errPassMatch } = require('./utils/errorHandlers'),
          { Users } = mongo,
          { display_name, password } = req.body;

    /*
      check database for user
    */

    const user = await Users.findOne({ display_name: display_name })
                            .catch(err => errLoginFind(err));

    // if no user is found, gtfo
    if (!user) {
      res.json({ "error": "Invalid user or password" });
      return;
    }

    /*
      verify password
    */

    const match = await verifyPassword(password, user.password)
                            .catch(err => errPassMatch(err));

    /*
      jwt token builder, sets cookies, returns username
    */

    const setCookie = async userObj => {
      // create tokens
      const cookieToken = await jwt.sign(userObj, jwtSecret, { expiresIn: "14d" });

      // create expiration date for cookie (ms * s * m * h * d)
      const expDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 12);

      // set token in cookie, cookie in header
      res.cookie("Nightlife", cookieToken, { httpOnly: true, expires: expDate });

      return { "display_name": userObj.display_name };
    }

    /*
      build response based on db query & password verification results
    */

    const response = (user && match)
      ? await setCookie(user)
      : { "error": "Invalid user or password" };

    res.json(response);
  });

  // set main/fallback route for all non-api requests
  app.get('/*', (req, res) => {

    /*
      I'm going to want to check req.cookies for returning user, redirect
      to login route ? maybe create procedure to authorize and set Auth
      header ?

      consider this a feature upgrade, not part of MVP
    */

    res.sendFile(__dirname + '/public/index.html');
  });

  // start server
  app.listen(app.get('port'), () => {
    console.log(`Nightlife Server Running on Port ${ port }.`);
  });
}

start();
