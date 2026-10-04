import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { jwtDecode } from "jwt-decode";

// NextAuth's `token` is its own encrypted session JWT. accessToken was copied
// into it by the jwt callback from the provider's token endpoint, so decoding
// it to read realm roles is reading a provider-issued token, not a request
// token. (`authorization: { params }` is provider config, not a header read.)
const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER,
      authorization: { params: { scope: "openid email profile" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      const decoded: any = jwtDecode(token.accessToken as string);
      session.roles = decoded.realm_access?.roles ?? [];
      session.user.role = decoded.role;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
