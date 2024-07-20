import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // redirect to login if access from /
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(
      new URL("/login", request.nextUrl.origin).href
    );
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    let res = await getToken({ req: request });

    if (!res) {
      return NextResponse.redirect(
        new URL("/login", request.nextUrl.origin).href
      );
    }
  }

  if (request.nextUrl.pathname.startsWith("/login")) {
    let res = await getToken({ req: request });
    if (res) {
      return NextResponse.redirect(
        new URL("/dashboard", request.nextUrl.origin).href
      );
    }
  }
}
