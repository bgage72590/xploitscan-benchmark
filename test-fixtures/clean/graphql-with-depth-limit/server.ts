// Apollo Server WITH a depth limit applied via graphql-armor.
// VC204/VC205 must NOT fire.
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloArmor } from "@escape.tech/graphql-armor";

const armor = new ApolloArmor({
  maxDepth: { n: 7 },
  costLimit: { maxCost: 1000 },
});

const server = new ApolloServer({
  typeDefs: "type Query { hello: String }",
  resolvers: { Query: { hello: () => "hi" } },
  ...armor.protect(),
});

await startStandaloneServer(server, { listen: { port: 4000 } });
