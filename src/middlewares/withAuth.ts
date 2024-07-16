// import { getSession } from "next-auth/react";
import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";

export default function withAuth(
  middleware: NextMiddleware,
  requireAuth: string[] = []
) {
  return async (req: NextRequest, next: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;
    // const session = await getSession({ req: req as any });
    if (requireAuth.includes(pathname)) {
      console.log("pathname", pathname);
      // console.log("session", session);
    }
    return middleware(req, next);
  };
}
