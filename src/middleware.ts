import { jwtVerify } from 'jose';
import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
   // redirect to login if access from /
   if (request.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.nextUrl.origin).href);
   }

   if (request.nextUrl.pathname.startsWith('/dashboard')) {
      let res = await getToken({ req: request });
      const jwtToken = res?.jwt;

      if (!res) {
         return NextResponse.redirect(new URL('/login', request.nextUrl.origin).href);
      } else {
         try {
            const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? '');
            const { payload } = await jwtVerify(jwtToken as string, secret);
            return NextResponse.next();
         } catch (error) {
            return NextResponse.redirect(new URL('/login', request.nextUrl.origin).href);
         }
      }
   }

   if (request.nextUrl.pathname.startsWith('/login')) {
      let res = await getToken({ req: request });
      const jwtToken = res?.jwt;
      if (res) {
         try {
            const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? '');
            const { payload } = await jwtVerify(jwtToken as string, secret);
            return NextResponse.redirect(new URL('/dashboard', request.nextUrl.origin).href);
         } catch (error) {
            return NextResponse.next();
         }
      } else {
         return NextResponse.next();
      }
   }
}
