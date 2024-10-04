const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { registerAdmin } = require('./controllers/auth');
const { typeDefs } = require('./graphql/typeDefs');
const { resolvers } = require('./graphql/resolvers');
const { processApolloContext } = require('./graphql/utils');

const app = express();
app.use(express.json());

// Auth Routes
app.post('/register-admin', registerAdmin);

const server = new ApolloServer({
  typeDefs, resolvers, context: processApolloContext
});

server.start().then(() => {
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
  });
});
