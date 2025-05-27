import { type NextRequest } from "next/server";
import { updateSession } from "../supabase/middleware";

export async function middleware(request: NextRequest) {
  //await highlightMiddleware(request);
  // update user's auth session
  // console.log("🔥 Middleware running for path:", request.nextUrl.pathname);
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
