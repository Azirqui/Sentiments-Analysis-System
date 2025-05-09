// /app/api/2fa/generate/route.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import * as speakeasy from "speakeasy"
import * as QRCode from "qrcode"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 })

  const secret = speakeasy.generateSecret({
    name: `SecureApp:${session.user.email}`,
  })

  await prisma.user.update({
    where: { email: session.user.email },
    data: { twoFactorSecret: secret.base32 },
  })

  const qrCode = await QRCode.toDataURL(secret.otpauth_url || "")

  return Response.json({ qrCode, secret: secret.base32 })
}
