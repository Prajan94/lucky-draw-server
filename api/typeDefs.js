const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Player {
    name: String!
    id: Int
    title: String
    score: Int!
    lastUpdated: String!
    userId: Int
  }
  
  type User {
    id: Int!
    username: String!
    role: Role!
  }
  
  type Role {
    id: Int!
    name: String!
  }

  type Query {
    getLeaderBoard: [Player!]!
    getUserRole(username: String!): User
    getPlayers: [Player!]!
  }

  type Mutation {
    addPlayer(name: String!, score: Int!): Player!
  }

  type Mutation {
    deletePlayer(id: Int!): Boolean!
  }

  type Mutation {
    updatePlayer(name: String!, id: Int!, score: Int!): Player!
  }
  
`;

module.exports = { typeDefs };
