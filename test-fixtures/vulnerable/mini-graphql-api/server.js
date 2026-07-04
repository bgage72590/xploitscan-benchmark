// Apollo server with introspection enabled in production (VC051).

const { ApolloServer } = require("@apollo/server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  csrfPrevention: false,
});

module.exports = server;
