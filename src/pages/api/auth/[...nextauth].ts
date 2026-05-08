import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/error",
    verifyRequest: "/verify-request",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 1, // 7 days in seconds
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 1, // 7 days
  },
});
