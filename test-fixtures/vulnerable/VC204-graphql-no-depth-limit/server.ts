// Apollo Server with no depth limit. Attacker submits a deeply-nested
// query and DoS's the resolver. VC204 must fire.
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
  type User { id: ID!, friends: [User!]! }
  type Query { user(id: ID!): User }
`;

const resolvers = {
  Query: {
    user: (_: unknown, { id }: { id: string }) => ({ id, friends: [] }),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // No validationRules / depthLimit / graphql-armor
});

await startStandaloneServer(server, { listen: { port: 4000 } });
