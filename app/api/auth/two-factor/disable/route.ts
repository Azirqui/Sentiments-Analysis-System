import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import  prisma from "@/lib/prisma"
import { verifyTwoFactorToken, disableTwoFactor } from "@/lib/two-factor"
import { logAuthEvent } from "@/lib/audit"

// Input validation schema
const disableSchema = z.object({
  token: z.string().length(6, "Verification code must be 6 digits"),
})

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse and validate request body
    const body = await req.json()
    const result = disableSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.flatten() }, { status: 400 })
    }

    const { token } = result.data

    // Get the user's 2FA secret
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    })

    if (!user || !user.twoFactorSecret || !user.twoFactorEnabled) {
      return NextResponse.json({ error: "Two-factor authentication not enabled" }, { status: 400 })
    }

    // Verify the token
    const isValid = verifyTwoFactorToken(user.twoFactorSecret, token)

    if (!isValid) {
      // Log failed verification
      await logAuthEvent({
        userId: session.user.id as string,
        type: "2FA_DISABLE",
        ip: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown",
        status: "FAILED",
        details: "Invalid token",
      })

      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    // Disable 2FA
    await disableTwoFactor(session.user.id as string)

    // Log successful disabling
    await logAuthEvent({
      userId: session.user.id as string,
      type: "2FA_DISABLE",
      ip: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "SUCCESS",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("2FA disable error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
