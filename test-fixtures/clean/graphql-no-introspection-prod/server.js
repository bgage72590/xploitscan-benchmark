// Apollo Server with introspection disabled in production AND graphql-armor
// (depth + complexity limits) applied. VC051, VC204, VC205 must NOT fire.

const { ApolloServer } = require("@apollo/server");
const { ApolloArmor } = require("@escape.tech/graphql-armor");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const isProd = process.env.NODE_ENV === "production";

// graphql-armor bundles maxDepth, maxAliases, maxDirectives, costLimit, etc.
// One plugin covers VC204 (depth) and VC205 (complexity) at sane defaults.
const armor = new ApolloArmor({
  maxDepth: { n: 7 },
  costLimit: { maxCost: 1000 },
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: !isProd,
  ...armor.protect(),
});

module.exports = server;
