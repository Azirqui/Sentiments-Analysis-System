// export function SecurityHeaders() {
//   // Set security headers
//   const cspHeader = `
//     default-src 'self';
//     script-src 'self' 'unsafe-inline' 'unsafe-eval';
//     style-src 'self' 'unsafe-inline';
//     img-src 'self' blob: data:;
//     font-src 'self';
//     connect-src 'self';
//     frame-ancestors 'none';
//     form-action 'self';
//     base-uri 'self';
//     object-src 'none';
//   `
//     .replace(/\s+/g, " ")
//     .trim()

//   // Set headers
//   const headers = {
//     "Content-Security-Policy": cspHeader,
//     "X-Content-Type-Options": "nosniff",
//     "X-Frame-Options": "DENY",
//     "X-XSS-Protection": "1; mode=block",
//     "Referrer-Policy": "strict-origin-when-cross-origin",
//     "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
//   }

//   // Apply headers
//   Object.entries(headers).forEach(([key, value]) => {
//     headers().set(key, value)
//   })

//   return null
// }

// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function SecurityHeaders(req: NextRequest) {
  const res = NextResponse.next()

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    connect-src 'self';
    frame-ancestors 'none';
    form-action 'self';
    base-uri 'self';
    object-src 'none';
  `
    .replace(/\s+/g, " ")
    .trim()

  res.headers.set("Content-Security-Policy", cspHeader)
  res.headers.set("X-Content-Type-Options", "nosniff")
  res.headers.set("X-Frame-Options", "DENY")
  res.headers.set("X-XSS-Protection", "1; mode=block")
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  return res
}
