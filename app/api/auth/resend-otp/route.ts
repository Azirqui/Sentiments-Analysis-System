import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import  prisma  from "@/lib/prisma"
import { generateOTP } from "@/lib/otp"
import { sendVerificationEmail } from "@/lib/email"
import { logAuthEvent } from "@/lib/audit"
import { rateLimit } from "@/lib/rate-limit"

// Input validation schema
const resendSchema = z.object({
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting - stricter for resend to prevent abuse
    const ip = req.headers.get("x-forwarded-for") || "unknown"
    const { success, limit, remaining, reset } = await rateLimit(ip, 3, 60) // 3 requests per minute

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
    const result = resendSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.flatten() }, { status: 400 })
    }

    const { email } = result.data

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user is already verified
    if (user.emailVerified) {
      return NextResponse.json({ error: "Email already verified" }, { status: 400 })
    }

    // Generate new OTP
    const { otp, expiresAt } = generateOTP()

    // Update user with new OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpSecret: otp,
        otpExpiry: expiresAt,
      },
    })

    // Send verification email
    await sendVerificationEmail(email, otp)

    // Log the resend event
    await logAuthEvent({
      userId: user.id,
      type: "RESEND_OTP",
      ip,
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "SUCCESS",
    })

    return NextResponse.json({ message: "Verification code resent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Resend OTP error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
