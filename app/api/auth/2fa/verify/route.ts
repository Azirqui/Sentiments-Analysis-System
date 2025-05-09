// /app/api/2fa/verify/route.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import * as speakeasy from "speakeasy"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 })

  const { token } = await req.json()

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  const isVerified = speakeasy.totp.verify({
    secret: user?.twoFactorSecret || "",
    encoding: "base32",
    token,
    window: 1,
  })

  if (!isVerified) {
    return new Response("Invalid token", { status: 400 })
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { twoFactorEnabled: true },
  })

  return new Response("2FA enabled", { status: 200 })
}
