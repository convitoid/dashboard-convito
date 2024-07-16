import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import withAuth from "./middlewares/withAuth";
import middleware from "next-auth/middleware";

// This function can be marked `async` if using `await` inside
export function mainMiddleware(req: NextRequest) {
  // console.log("dari main middleware", withAuth);
  const res = NextResponse.next();
  return res;
}

export default withAuth(mainMiddleware, ["/dashboard"]);
