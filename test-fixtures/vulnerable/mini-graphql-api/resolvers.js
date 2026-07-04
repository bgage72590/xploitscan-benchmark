// User-update mutation that mass-assigns input straight into the model.
// VC042 inside a GraphQL resolver.

module.exports = {
  Mutation: {
    async updateProfile(_root, { input }, ctx) {
      const user = await ctx.db.User.findByPk(ctx.userId);
      await user.update({ ...input });
      return user;
    },
  },
};
