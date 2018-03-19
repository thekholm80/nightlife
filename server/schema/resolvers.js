const { barListByLocation } = require('./queries/barListByLocation'),
      { barDetailsByID } = require('./queries/barDetailsByID'),
      { addMeToBar } = require('./mutations/addMeToBar'),
      { removeMeFromBar } = require('./mutations/removeMeFromBar');

module.exports = {
  Query: {
    barListByLocation,
    barDetailsByID
  },

  Mutation: {
    addMeToBar,
    removeMeFromBar
  }
}

/*
  Notes:
  **applies to queries (in seperate files now)**
  Query arguments are part of the data object passed into the resolver,
  I've destructured the object to pull the key off ( , { loc }, )

  Also, abstracting everything into seperate files for readability
*/
