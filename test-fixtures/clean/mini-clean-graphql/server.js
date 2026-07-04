// Clean Apollo Server: introspection disabled in production, CSRF
// prevention on, per-resolver auth check enforced, graphql-armor for
// depth + complexity limits. VC051, VC042, VC204, VC205, VC206 must
// NOT fire.

const { ApolloServer } = require("@apollo/server");
const { ApolloArmor } = require("@escape.tech/graphql-armor");
const typeDefs = require("./schema");

const isProd = process.env.NODE_ENV === "production";

const armor = new ApolloArmor({
  maxDepth: { n: 7 },
  costLimit: { maxCost: 1000 },
});

const resolvers = {
  Mutation: {
    async updateProfile(_root, { input }, ctx) {
      if (!ctx.userId) throw new Error("unauthenticated");
      const allowed = {
        displayName: typeof input.displayName === "string" ? input.displayName : undefined,
        bio: typeof input.bio === "string" ? input.bio : undefined,
      };
      const user = await ctx.db.User.findByPk(ctx.userId);
      await user.update(allowed);
      return user;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: !isProd,
  csrfPrevention: true,
  ...armor.protect(),
});

module.exports = server;
