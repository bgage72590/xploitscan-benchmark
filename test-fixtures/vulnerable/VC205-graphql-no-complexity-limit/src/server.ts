import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import depthLimit from "graphql-depth-limit";
import { prisma } from "./db";

const typeDefs = `#graphql
  type Comment { id: ID!, body: String!, author: User! }
  type Post { id: ID!, title: String!, comments(first: Int = 50): [Comment!]! }
  type User { id: ID!, name: String!, posts(first: Int = 50): [Post!]! }
  type Query { users(first: Int = 50): [User!]! }
`;

const resolvers = {
  Query: {
    users: (_: unknown, { first }: { first: number }) => prisma.user.findMany({ take: first }),
  },
  User: {
    posts: (user: { id: string }, { first }: { first: number }) =>
      prisma.post.findMany({ where: { authorId: user.id }, take: first }),
  },
  Post: {
    comments: (post: { id: string }, { first }: { first: number }) =>
      prisma.comment.findMany({ where: { postId: post.id }, take: first }),
  },
  Comment: {
    author: (comment: { authorId: string }) => prisma.user.findUnique({ where: { id: comment.authorId } }),
  },
};

// Depth limit stops recursive queries, but nothing caps how many items each
// level fans out to: users(first: 10000) { posts(first: 10000) { comments(first: 10000) } }
const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5)],
});

await server.start();

const app = express();
app.use("/graphql", cors(), express.json(), expressMiddleware(server));
app.listen(4000, () => console.log("GraphQL ready at http://localhost:4000/graphql"));
