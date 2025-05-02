import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import  prisma  from "@/lib/prisma"
import { logAuthEvent } from "@/lib/audit"
import { rateLimit } from "@/lib/rate-limit"

// Input validation schema
const verifySchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
})

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown"
    const { success, limit, remaining, reset } = await rateLimit(ip)

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        },
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const result = verifySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.flatten() }, { status: 400 })
    }

    const { email, otp } = result.data

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if OTP is valid and not expired
    if (user.otpSecret !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      // Log failed verification attempt
      await logAuthEvent({
        userId: user.id,
        type: "VERIFY_OTP",
        ip,
        userAgent: req.headers.get("user-agent") || "unknown",
        status: "FAILED",
        details: "Invalid or expired OTP",
      })

      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        otpSecret: null,
        otpExpiry: null,
      },
    })

    // Log successful verification
    await logAuthEvent({
      userId: user.id,
      type: "VERIFY_OTP",
      ip,
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "SUCCESS",
    })

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
