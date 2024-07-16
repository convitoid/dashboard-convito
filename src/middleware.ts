import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { IncomingMessage } from "http";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const customReq: Partial<IncomingMessage> = {
      headers: Object.fromEntries(request.headers.entries()),
      url: request.url,
      method: request.method,
    };

    // get the token
    try {
      let res = await getSession({ req: customReq });
      if (!res) {
        return NextResponse.redirect(
          new URL("/login", request.nextUrl.origin).href
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  if (request.nextUrl.pathname.startsWith("/login")) {
    const customReq: Partial<IncomingMessage> = {
      headers: Object.fromEntries(request.headers.entries()),
      url: request.url,
      method: request.method,
    };

    // get the token
    try {
      let res = await getSession({ req: customReq });
      if (res) {
        return NextResponse.redirect(
          new URL("/dashboard", request.nextUrl.origin).href
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
}
