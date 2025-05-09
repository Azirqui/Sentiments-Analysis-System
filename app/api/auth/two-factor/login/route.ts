import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import  prisma from "@/lib/prisma"
import { verifyTwoFactorToken, verifyBackupCode } from "@/lib/two-factor"
import { logAuthEvent } from "@/lib/audit"

// Input validation schema
const loginSchema = z.object({
  email: z.string().email(),
  token: z.string().min(6).max(10), // Allow for backup codes which might be longer
  isBackupCode: z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json()
    const result = loginSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.flatten() }, { status: 400 })
    }

    const { email, token, isBackupCode = false } = result.data

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        twoFactorSecret: true,
        twoFactorEnabled: true,
        twoFactorBackupCodes: true,
      },
    })

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json({ error: "User not found or 2FA not enabled" }, { status: 400 })
    }

    let isValid = false

    if (isBackupCode) {
      // Verify backup code
      isValid = await verifyBackupCode(user.id, token)
    } else {
      // Verify TOTP token
      isValid = verifyTwoFactorToken(user.twoFactorSecret, token)
    }

    if (!isValid) {
      // Log failed verification
      await logAuthEvent({
        userId: user.id,
        type: "2FA_LOGIN",
        ip: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown",
        status: "FAILED",
        details: isBackupCode ? "Invalid backup code" : "Invalid token",
      })

      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    // Log successful verification
    await logAuthEvent({
      userId: user.id,
      type: "2FA_LOGIN",
      ip: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "SUCCESS",
    })

    // Return success - the frontend will complete the login process
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("2FA login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
