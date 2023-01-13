import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions = {
  // Configure one or more authentication providers
  site: process.env.NEXTAUTH_URL,
  adapter: PrismaAdapter(prisma),
  providers: [],
  callbacks: {
    async session({ session, token }: any) {
      return session;
    },
  },
};

export default NextAuth(authOptions);
