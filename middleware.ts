
// // middleware.ts
// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"
// import { getToken } from "next-auth/jwt"

// export async function middleware(request: NextRequest) {
//   // Get the pathname
//   const path = request.nextUrl.pathname
//   // Skip middleware for static files and API routes to prevent unnecessary processing
//   if (
//     path.startsWith('/_next') || 
//     path.startsWith('/api/') ||
//     path.includes('.') ||  // Skip files with extensions (like .css, .js, etc.)
//     path === '/favicon.ico'
//   ) {
//     return NextResponse.next()
//   }
//   // Public paths that don't require authentication
//   const isPublicPath = 
//     path === "/" || 
//     path === "/auth/login" || 
//     path === "/auth/register" || 
//     path === "/auth/verify" ||
//     path === "/auth/logout" ||
//     path.startsWith("/api/auth")
  
//   // Check if the user is authenticated - with no cache
//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//     secureCookie: process.env.NODE_ENV === "production",
//   })
  
//   // Add debug logging
//   console.log(`Path: ${path}, Authenticated: ${!!token}`);
  
//   // Redirect logic
//   if (!isPublicPath && !token) {
//     // If user is not authenticated and trying to access protected path, redirect to login
//     return NextResponse.redirect(new URL("/", request.url))
//   }
  
//   return NextResponse.next()
// }
// // Update matcher to exclude static files
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones we explicitly exclude
//      */
//     '/((?!_next/static|_next/image|favicon.ico).*)',
//   ],
// }
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for static files, API routes, and logout
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api/") ||
    path.includes(".") ||
    path === "/favicon.ico" ||
    path === "/auth/logout" // Explicitly allow logout path
  ) {
    return NextResponse.next();
  }

  // Public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path === "/auth/login" ||
    path === "/auth/register" ||
    path === "/auth/verify" ||
    path === "/auth/logout" ||
    path.startsWith("/api/auth");

  // Check if the user is authenticated
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  console.log(`Path: ${path}, Authenticated: ${!!token}`);

  // Redirect logic
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};