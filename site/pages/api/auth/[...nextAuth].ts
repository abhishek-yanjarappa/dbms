import NextAuth from "next-auth";

export const authOptions = {
  // Configure one or more authentication providers
  site: process.env.NEXTAUTH_URL,
  providers: [],
  callbacks: {
    async session({ session, token }: any) {
      return session;
    },
  },
};

export default NextAuth(authOptions);
