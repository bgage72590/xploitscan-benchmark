import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import depthLimit from "graphql-depth-limit";
import { GraphQLError } from "graphql";
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from "graphql-query-complexity";
import { prisma } from "./db";

const MAX_COMPLEXITY = 1000;

const typeDefs = `#graphql
  type Comment { id: ID!, body: String!, author: User! }
  type Post { id: ID!, title: String!, comments(first: Int = 50): [Comment!]! }
  type User { id: ID!, name: String!, posts(first: Int = 50): [Post!]! }
  type Query { users(first: Int = 50): [User!]! }
`;

const resolvers = {
  Query: {
    users: (_: unknown, { first }: { first: number }) => prisma.user.findMany({ take: Math.min(first, 100) }),
  },
  User: {
    posts: (user: { id: string }, { first }: { first: number }) =>
      prisma.post.findMany({ where: { authorId: user.id }, take: Math.min(first, 100) }),
  },
  Post: {
    comments: (post: { id: string }, { first }: { first: number }) =>
      prisma.comment.findMany({ where: { postId: post.id }, take: Math.min(first, 100) }),
  },
  Comment: {
    author: (comment: { authorId: string }) => prisma.user.findUnique({ where: { id: comment.authorId } }),
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
  validationRules: [depthLimit(5)],
  plugins: [
    {
      async requestDidStart() {
        return {
          async didResolveOperation({ request, document }) {
            const complexity = getComplexity({
              schema,
              operationName: request.operationName,
              query: document,
              variables: request.variables,
              estimators: [fieldExtensionsEstimator(), simpleEstimator({ defaultComplexity: 1 })],
            });
            if (complexity > MAX_COMPLEXITY) {
              throw new GraphQLError(`Query is too complex: ${complexity}. Maximum allowed: ${MAX_COMPLEXITY}`, {
                extensions: { code: "QUERY_TOO_COMPLEX" },
              });
            }
          },
        };
      },
    },
  ],
});

await server.start();

const app = express();
app.use("/graphql", cors(), express.json(), expressMiddleware(server));
app.listen(4000, () => console.log("GraphQL ready at http://localhost:4000/graphql"));
