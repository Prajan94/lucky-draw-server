const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./api/typeDefs');
const { resolvers } = require('./api/resolvers');

async function createApp() {
  const app = express();
  app.use(cors());
//   app.use(express.json());

  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  return app;
}

module.exports = { createApp };
