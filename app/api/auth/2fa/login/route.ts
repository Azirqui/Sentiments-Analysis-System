// /app/api/2fa/login/route.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import * as speakeasy from "speakeasy"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 })

  const { token } = await req.json()

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  const isValid = speakeasy.totp.verify({
    secret: user?.twoFactorSecret || "",
    encoding: "base32",
    token,
    window: 1,
  })

  if (!isValid) {
    return new Response("Invalid 2FA token", { status: 401 })
  }

  // Re-issue session token without the "requiresTwoFactor" flag (handled in jwt callback)
  return new Response("2FA successful", { status: 200 })
}
