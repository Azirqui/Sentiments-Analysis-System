

import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateTwoFactorSecret } from "@/lib/two-factor";
import { logAuthEvent } from "@/lib/audit";
import * as speakeasy from "speakeasy"
import * as QRCode from "qrcode"
import { type } from "os";
import { decrypt } from "@/lib/two-factor";
// export async function GET(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || !session.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     if (!session.user.email) {
//       return NextResponse.json({ error: "User email not found in session" }, { status: 400 });
//     }
    
//     const user = await prisma.user.findUnique({
//       where: { email: session.user.email },
//       select: { id: true, email: true, twoFactorSecret: true },
//     });
    
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // ✅ If secret already exists, do not regenerate it
//     if (user.twoFactorSecret) {    
//       const qrCodeUrl = speakeasy.otpauthURL({
//           secret: user.twoFactorSecret,
//           label: user.email ?? '',
//           issuer: "YourAppName", // 👈 customize this for your app
//         });
//         return NextResponse.json({
//           qrCodeUrl,
//           secret: user.twoFactorSecret,
//         });
//       }

//     // ✅ Generate a new secret and QR code
//     const { secret, qrCodeUrl } = await generateTwoFactorSecret(session.user.id as string, session.user.email as string);

//     await logAuthEvent({
//       userId: user.id,
//       type: "2FA_SETUP",
//       ip: req.headers.get("x-forwarded-for") || "unknown",
//       userAgent: req.headers.get("user-agent") || "unknown",
//       status: "INITIATED",
//     });

//     return NextResponse.json({
//       qrCodeUrl,
//       secret,
//     });

//   } catch (error) {
//     console.error("2FA setup error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const force = req.nextUrl.searchParams.get("force") === "true";
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.email) {
      return NextResponse.json({ error: "User email not found in session" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, twoFactorSecret: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ If user already has a secret and no regeneration requested
    if (user.twoFactorSecret && !force) {
      const decryptedSecret = decrypt(user.twoFactorSecret);

      const qrCodeUrl = speakeasy.otpauthURL({
        secret: decryptedSecret,
        label: user.email ?? '',
        issuer: "YourAppName",
      });

      return NextResponse.json({ qrCodeUrl, secret: decryptedSecret });
    }

    // ✅ Generate a new secret
    const { secret, qrCodeUrl } = await generateTwoFactorSecret(session.user.id as string, session.user.email as string);

    await logAuthEvent({
      userId: user.id,
      type: "2FA_SETUP",
      ip: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "INITIATED",
    });

    return NextResponse.json({ qrCodeUrl, secret });

  } catch (error) {
    console.error("2FA setup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
function getLabel(): string | null {
  throw new Error("Function not implemented.");
}

