
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Skip middleware for static files, API routes, and logout
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api/") ||
    path.includes(".") ||
    path === "/favicon.ico" ||
    path === "/auth/logout" // Explicitly allow logout path
  ) {
    return NextResponse.next()
  }

  // Public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path === "/auth/login" ||
    path === "/auth/register" ||
    path === "/auth/verify" ||
    path === "/auth/logout" ||
    path === "/auth/two-factor" || // Add this line to make 2FA page public
    path.startsWith("/api/auth")

  // Check if the user is authenticated
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  })

  console.log(
    "Middleware path:",
    path,
    "Token:",
    token ? "exists" : "none",
    token?.requiresTwoFactor ? "2FA required" : "",
  )

  // Check if 2FA is required but not completed
  // const requiresTwoFactor = token?.requiresTwoFactor === true
  const twoFactorVerified = request.cookies.get("twoFactorVerified")?.value === "true"
  const requiresTwoFactor = token?.requiresTwoFactor === true && !twoFactorVerified
  
  // If 2FA is required, only allow access to the 2FA page
  if (requiresTwoFactor && path !== "/auth/two-factor" && !path.startsWith("/api/auth")) {
    console.log("Redirecting to 2FA page from:", path)
    return NextResponse.redirect(
      new URL(`/auth/two-factor?email=${encodeURIComponent(token.email as string)}`, request.url),
    )
  }
  const requiresTwoFactorSetup = token?.requiresTwoFactorSetup === true

// If 2FA setup is required, force redirect
if (requiresTwoFactorSetup && path !== "/auth/setup-2fa") {
  console.log("Redirecting to setup 2FA page")
  return NextResponse.redirect(
    new URL(`/auth/setup-2fa?email=${encodeURIComponent(token.email as string)}`, request.url)
  )
}

  // Redirect logic
  if (isPublicPath && token && !requiresTwoFactor) {
    // If user is authenticated and trying to access public path, redirect to home
    console.log("Redirecting authenticated user from public path to home")
    return NextResponse.redirect(new URL("/home", request.url))
  }

  if (!isPublicPath && (!token || requiresTwoFactor)) {
    // If user is not authenticated or needs 2FA and trying to access protected path, redirect to login
    console.log("Redirecting unauthenticated user to login")
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
