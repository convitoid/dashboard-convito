import { getSession } from 'next-auth/react';
import { NextFetchEvent, NextMiddleware, NextRequest } from 'next/server';

export default function withAuth(middleware: NextMiddleware, requireAuth: string[] = []) {
   return async (req: NextRequest, next: NextFetchEvent) => {
      const pathname = req.nextUrl.pathname;
      if (requireAuth.includes(pathname)) {
      }
      return middleware(req, next);
   };
}
