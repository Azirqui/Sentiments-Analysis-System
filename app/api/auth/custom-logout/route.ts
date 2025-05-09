// // app/api/auth/custom-logout/route.ts
// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"

// export async function POST(req: NextRequest) {
//   try {
//     // Get the current session
//     const session = await getServerSession(authOptions)
    
//     // If there's no session, return success
//     if (!session) {
//       return NextResponse.json({ success: true })
//     }
    
//     // Clear cookies manually (this is a backup approach)
//     const response = NextResponse.json({ success: true })
//     response.cookies.delete("next-auth.session-token");
//     response.cookies.delete("next-auth.csrf-token");
//     response.cookies.delete("next-auth.callback-url");
//     response.cookies.delete("__Secure-next-auth.session-token");
//     response.cookies.delete("__Secure-next-auth.csrf-token");
//     response.cookies.delete("__Host-next-auth.csrf-token");
    
//     return response
//   } catch (error) {
//     console.error("Custom logout error:", error)
//     return NextResponse.json({ error: "Failed to logout" }, { status: 500 })
//   }
// }
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    // Create a response
    const response = NextResponse.json({ success: true })

    // Clear all possible auth cookies
    const cookiesToClear = [
      "next-auth.session-token",
      "next-auth.csrf-token",
      "next-auth.callback-url",
      "__Secure-next-auth.session-token",
      "__Secure-next-auth.csrf-token",
      "__Host-next-auth.csrf-token",
    ]

    cookiesToClear.forEach((cookieName) => {
      response.cookies.delete(cookieName)
    })

    return response
  } catch (error) {
    console.error("Manual logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
