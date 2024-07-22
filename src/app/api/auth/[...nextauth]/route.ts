import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsContainer from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "secret",
  providers: [
    CredentialsContainer({
      type: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };
        const user: any = {
          id: 1,
          name: "Admin",
          email: "admin@mail.com",
          role: "admin",
        };

        if (username === "admin" && password === "admin") {
          return {
            ...user,
            jwt: jwt.sign(user, process.env.NEXTAUTH_SECRET || "secret", {
              expiresIn: "1h",
            }),
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }: any) {
      if (account?.provider === "credentials") {
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.jwt = user.jwt;
      }
      return token;
    },

    async session({ session, token }: any) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
