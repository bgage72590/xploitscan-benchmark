// Apollo Server with csrfPrevention explicitly disabled — removes the
// default protection against simple-request CSRF on mutations.
// VC206 must fire.
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const server = new ApolloServer({
  typeDefs: "type Query { hello: String }",
  resolvers: { Query: { hello: () => "hi" } },
  csrfPrevention: false,
});

await startStandaloneServer(server, { listen: { port: 4000 } });
