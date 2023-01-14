import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbCLient from "../../../lib/prismadb";
import { Session } from "next-auth";

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
    async session({ session, token }: { session: Session; token: any }) {
      // By unique identifier
      const agentUser = await dbCLient.agent.findUnique({
        where: {
          //@ts-ignore
          email: token?.email,
        },
        select: {
          name: true,
          email: true,
          photo: true,
          id: true,
          Enterprize: {
            select: {
              name: true,
              photo: true,
              email: true,
              id: true,
            },
          },
        },
      });
      if (!agentUser) {
        const newAgentUser = await dbCLient.agent.create({
          data: {
            name: token?.name,
            googleId: token?.sub,
            email: token?.email,
            photo: token?.picture,
          },
        });
        session.user = newAgentUser;
        return session;
      } else {
        session.user = agentUser;
        return session;
      }
    },
  },
};

export default NextAuth(authOptions);
