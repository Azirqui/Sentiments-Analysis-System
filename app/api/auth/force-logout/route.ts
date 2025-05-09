// // app/api/auth/force-logout/route.ts
// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
// import  prisma  from "@/lib/prisma"
// import { cookies } from 'next/headers'
// export async function POST(req: NextRequest) {
//   try {
//     // Get the current session
//     const session = await getServerSession(authOptions)
    
//     // Create a response that clears auth cookies
//     const response = new NextResponse(JSON.stringify({ success: true }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//     console.log("Session:", session)
//     console.log(response.cookies)
//     // Clear all possible auth cookies
//     const cookiesToClear = [
//       "next-auth.session-token",
//       "next-auth.csrf-token",
//       "next-auth.callback-url",
//       "__Secure-next-auth.session-token",
//       "__Secure-next-auth.csrf-token",
//       "__Host-next-auth.csrf-token"
//     ]
//     const isProduction = process.env.NODE_ENV === "production";
//     // cookiesToClear.forEach(name => {
//     //   response.cookies.set(name, "", { path: "/", expires: new Date(0) });
//     // });
//     cookiesToClear.forEach(name => {
//       response.cookies.set(name, "", {
//         path: "/",
//         expires: new Date(0),
//         httpOnly: true,
//         sameSite: "lax",
//         secure: process.env.NODE_ENV === "production",
//       });
//     });
//     cookiesToClear.forEach(name => {
//       response.cookies.delete(name)});

//       (await cookies()).set("next-auth.session-token", "", {
//         path: "/",
//         expires: new Date(0),
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//       });
//       cookiesToClear.forEach((cookieName) => {
//         response.headers.append("Set-Cookie", `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax; Secure`);
//       });
//       cookiesToClear.forEach((name) => {
//         response.headers.append(
//           "Set-Cookie",
//           `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax; ${isProduction ? "Secure;" : ""}`
//         );
//       });
//     return response
//   } catch (error) {
//     console.error("Force logout error:", error)
//     return NextResponse.json({ error: "Logout failed" }, { status: 500 })
//   }
// }
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import signOut  from "next-auth";

// export async function POST(req: NextRequest) {
//   try {
//     // Invalidate the session and clear cookies using NextAuth's signOut
//     await signOut({ redirect: false });

//     // Return a success response
//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (error) {
//     console.error("Force logout error:", error);
//     return NextResponse.json({ error: "Logout failed" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // <-- where your authOptions are defined

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No active session" }, { status: 401 });
    }

    // If you're using database sessions, you would delete it here
    // Otherwise, you can just clear cookies (if using JWT sessions)

    // Clear the session cookie
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set("next-auth.session-token", "", { expires: new Date(0) }); // For database sessions
    response.cookies.set("next-auth.callback-url", "", { expires: new Date(0) }); // Optional
    response.cookies.set("next-auth.csrf-token", "", { expires: new Date(0) }); // Optional
    response.cookies.set("twoFactorVerified", "", { expires: new Date(0) }); // <-- Clear 2FA flag

    return response;
  } catch (error) {
    console.error("Force logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
