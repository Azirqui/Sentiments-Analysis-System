// import { type NextRequest, NextResponse } from "next/server"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
// import { z } from "zod"
// import  prisma  from "@/lib/prisma"
// import { logAuthEvent } from "@/lib/audit"

// // Input validation schema
// const profileSchema = z.object({
//   name: z.string().min(2).max(100),
//   // Add more fields as needed
// })
// type CustomSession = {
//   user: {
//     id: string
//     name?: string | null
//     email?: string | null
//     image?: string | null
//   }
// }
// export async function PUT(req: NextRequest) {
//   try {
//     // Check authentication
//     const session = await getServerSession(authOptions) as CustomSession | null

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Parse and validate request body
//     const body = await req.json()
//     const result = profileSchema.safeParse(body)

//     if (!result.success) {
//       return NextResponse.json({ error: "Invalid input", details: result.error.flatten() }, { status: 400 })
//     }

//     const { name } = result.data

//     // Update user profile
//     const updatedUser = await prisma.user.update({
//       where: { id: session.user.id },
//       data: { name },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         emailVerified: true,
//         image: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     })

//     // Log profile update event
//     const ip = req.headers.get("x-forwarded-for") || "unknown"
//     await logAuthEvent({
//       userId: session.user.id,
//       type: "PROFILE_UPDATE",
//       ip,
//       userAgent: req.headers.get("user-agent") || "unknown",
//       status: "SUCCESS",
//     })

//     return NextResponse.json(updatedUser, { status: 200 })
//   } catch (error) {
//     console.error("Profile update error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     // Check authentication
//     const session = await getServerSession(authOptions)

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Get user profile
//     const user = await prisma.user.findUnique({
//       where: { id: session.user.id },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         emailVerified: true,
//         image: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     })

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     return NextResponse.json(user, { status: 200 })
//   } catch (error) {
//     console.error("Get profile error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { logAuthEvent } from "@/lib/audit"

// Define a custom session type that includes id
type CustomSession = {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

// Input validation schema
const profileSchema = z.object({
  name: z.string().min(2).max(100),
  // Add more fields as needed
})

export async function PUT(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use type assertion to tell TypeScript that session.user has an id
    const userId = (session.user as any).id

    // Parse and validate request body
    const body = await req.json()
    const result = profileSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.flatten() }, { status: 400 })
    }

    const { name } = result.data

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Log profile update event
    const ip = req.headers.get("x-forwarded-for") || "unknown"
    await logAuthEvent({
      userId: userId,
      type: "PROFILE_UPDATE",
      ip,
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "SUCCESS",
    })

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use type assertion to tell TypeScript that session.user has an id
    const userId = (session.user as any).id

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}