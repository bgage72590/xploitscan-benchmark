const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const mongoose = require("mongoose");
const Customer = require("./models/Customer");
const { userFromToken } = require("./auth");

// The API never returns a full SSN: the resolver below masks all but the
// last four digits.
const typeDefs = `#graphql
  type Customer {
    id: ID!
    name: String!
    email: String!
    ssn: String
  }

  type Query {
    customer(id: ID!): Customer
  }
`;

const resolvers = {
  Query: {
    customer: async (_, { id }, { user }) => {
      if (!user) throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHENTICATED" } });
      return Customer.findById(id);
    },
  },
  Customer: {
    ssn: (customer) => (customer.ssn ? `***-**-${customer.ssn.slice(-4)}` : null),
  },
};

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => ({ user: await userFromToken(req.headers.authorization) }),
  });
  console.log(`GraphQL API ready at ${url}`);
}

main();
