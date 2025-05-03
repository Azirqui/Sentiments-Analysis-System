import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { hash } from "bcryptjs"
import  prisma  from "@/lib/prisma"
import { generateOTP } from "@/lib/otp"
import { sendVerificationEmail } from "@/lib/email"
import { logAuthEvent } from "@/lib/audit"
import { rateLimit } from "@/lib/rate-limit"

// Input validation schema
const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
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
    const result = registerSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.flatten() }, { status: 400 })
    }

    const { name, email, password } = result.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Generate OTP
    const { otp, expiresAt } = generateOTP()

    // Create user with unverified status
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null,
        otpSecret: otp,
        otpExpiry: expiresAt,
      },
    })

    // Send verification email
    await sendVerificationEmail(email, otp)

    // Log the registration event
    await logAuthEvent({
      userId: user.id,
      type: "REGISTER",
      ip,
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "SUCCESS",
    })

    return NextResponse.json(
      {
        message: "User registered successfully. Please verify your email.",
        email,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
