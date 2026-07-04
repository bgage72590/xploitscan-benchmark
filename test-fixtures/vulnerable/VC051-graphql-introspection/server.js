// Apollo Server with introspection explicitly enabled in production.
// Attackers can walk the entire schema, including internal mutations.
// VC051 must fire.

const { ApolloServer } = require("@apollo/server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

module.exports = server;
