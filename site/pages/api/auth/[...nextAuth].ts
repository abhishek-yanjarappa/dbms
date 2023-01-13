import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbCLient from "../../../lib/prismadb";

export const authOptions = {
  // Configure one or more authentication providers
  site: process.env.NEXTAUTH_URL,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    } as any),
  ],
  callbacks: {
    async session({ session, token }: any) {
      console.log(token);
      console.log(session);
      return session;
    },
  },
};

export default NextAuth(authOptions);
