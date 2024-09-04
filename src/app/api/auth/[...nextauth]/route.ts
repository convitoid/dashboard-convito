import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsContainer from 'next-auth/providers/credentials';
import jwt from 'jsonwebtoken';
import prisma from '@/libs/prisma';
import bcrypt from 'bcrypt';

interface User {
   id: string;
   name: string;
   email: string;
   jwt: string;
}

const authOptions: NextAuthOptions = {
   session: {
      strategy: 'jwt',
   },
   secret: process.env.NEXTAUTH_SECRET || 'secret',
   providers: [
      CredentialsContainer({
         type: 'credentials',
         name: 'Credentials',
         credentials: {
            username: { label: 'Username', type: 'text' },
            password: { label: 'Password', type: 'password' },
         },

         async authorize(credentials): Promise<User | null> {
            const { username, password } = credentials as {
               username: string;
               password: string;
            };

            const user = await prisma.user.findFirst({
               where: {
                  username: username,
               },
            });

            if (user && user.password) {
               const isPasswordMatch = await bcrypt.compare(password, user.password);
               if (isPasswordMatch) {
                  return {
                     id: user.id.toString(),
                     name: user.username,
                     email: user.email,
                     jwt: jwt.sign(user, process.env.NEXTAUTH_SECRET || 'secret', {
                        expiresIn: '1d',
                     }),
                  };
               } else {
                  return null;
               }
            } else {
               return null;
            }
         },
      }),
   ],
   callbacks: {
      async jwt({ token, account, profile, user }: any) {
         if (account?.provider === 'credentials') {
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
      signIn: '/login',
   },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
