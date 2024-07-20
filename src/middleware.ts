import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    console.log("masuk ke dashboard");
    let res = await getToken({ req: request });

    console.log(res);
    if (!res) {
      return NextResponse.redirect(
        new URL("/login", request.nextUrl.origin).href
      );
    }
  }

  if (request.nextUrl.pathname.startsWith("/login")) {
    console.log("masuk ke login");
    let res = await getToken({ req: request });

    console.log(res);
    if (res) {
      return NextResponse.redirect(
        new URL("/dashboard", request.nextUrl.origin).href
      );
    }
  }

  return NextResponse.next();
}
