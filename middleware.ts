import { type NextRequest } from "next/server";
import { updateSession } from "$/supabase/middleware";
//import { highlightMiddleware } from "@highlight-run/next/server";

export async function middleware(request: NextRequest) {
  //await highlightMiddleware(request);
  // update user's auth session
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
