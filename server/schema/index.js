const { makeExecutableSchema } = require('graphql-tools'),
      resolvers = require('./resolvers');

const typeDefs = `
  type Address {
    display_address: [String]
  }

  type Bar {
    id: ID
    image_url: String
    url: String
    name: String
    location: Address
    display_phone: String
    attending_count: Int
    error: String
  }

  type Categories {
    alias: String
    title: String
  }

  type Attending {
    attending: [Person]
    error: String
  }

  type Person {
    display_name: String
  }

  type BarDetails {
    id: ID
    name: String
    image_url: String
    url: String
    display_phone: String
    categories: [Categories]
    rating: Float
    location: Address
    photos: [String]
    attendees: [Person]
    error: String
  }

  type Query {
    barListByLocation(loc: String!): [Bar]
    barDetailsByID(id: String!): BarDetails
  }

  type Mutation {
    addMeToBar(display_name: String!, bar_id: String!): Attending
    removeMeFromBar(display_name: String!, bar_id: String!): Attending
  }
`;

// combine typeDefs with resolvers to generate schema
module.exports = makeExecutableSchema({ typeDefs, resolvers });

/*
  Notes:
  the field names in the Bar and BarDetails typeDefs match fields returned by yelp API

  location field returns an object, so another typeDef had to be made to
  access next level of object (Address)

  query arguments have to be defined in the Query typeDef

  sample yelp query:
  query {
    barListByLocation(loc: "las vegas") {
      id
      name
      image_url
      url
      location {
        display_address
      }
      display_phone
    }
  }
*/
