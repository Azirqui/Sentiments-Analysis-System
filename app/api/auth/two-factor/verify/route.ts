
// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import prisma from "@/lib/prisma";
// import speakeasy from "speakeasy";
// import { cookies } from "next/headers";
// // Force node.js runtime so console.log works
// export const runtime = "nodejs";

// export async function POST(req: NextRequest) {
//   const session = await getServerSession(authOptions);

//   if (!session || !session.user?.email) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const body = await req.json();
//   const { token: totp } = body;

//   if (!totp) {
//     return NextResponse.json({ error: "Missing TOTP token" }, { status: 400 });
//   }

//   const user = await prisma.user.findUnique({
//     where: { email: session.user.email },
//     select: {
//       id: true,
//       twoFactorSecret: true,
//     },
//   });

//   if (!user?.twoFactorSecret) {
//     return NextResponse.json({ error: "2FA not set up" }, { status: 400 });
//   }

//   // ✅ These should now show up in the terminal
//   console.log("🔐 Secret from DB:", user.twoFactorSecret);
//   console.log("🔢 Token received:", totp);

//   const verified = speakeasy.totp.verify({
//     secret: user.twoFactorSecret,
//     encoding: "base32",
//     token: totp,
//     window: 1,
//   });
  
//   if (!verified) {
//     return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//   }
//   (await cookies()).set("twoFactorVerified", "true", {
//     httpOnly: true,
//     path: "/",
//     secure: process.env.NODE_ENV === "production",
//   });
//   await prisma.user.update({
//     where: { email: session.user.email },
//     data: { twoFactorEnabled: true },
//   });

//   return NextResponse.json({ success: true });
// }

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import speakeasy from "speakeasy";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/two-factor"; // <-- import your decrypt function

// Force node.js runtime so console.log works
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { token: totp } = body;

  if (!totp) {
    return NextResponse.json({ error: "Missing TOTP token" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      twoFactorSecret: true,
    },
  });

  if (!user?.twoFactorSecret) {
    return NextResponse.json({ error: "2FA not set up" }, { status: 400 });
  }

  // ✅ Decrypt the secret
  let decryptedSecret: string;
  try {
    decryptedSecret = decrypt(user.twoFactorSecret);
  } catch (error) {
    console.error("Failed to decrypt 2FA secret:", error);
    return NextResponse.json({ error: "Decryption failed" }, { status: 500 });
  }

  console.log("🔐 Decrypted secret:", decryptedSecret);
  console.log("🔢 Token received:", totp);

  const verified = speakeasy.totp.verify({
    secret: decryptedSecret,
    encoding: "base32",
    token: totp,
    window: 1,
  });

  if (!verified) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  (await cookies()).set("twoFactorVerified", "true", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  await prisma.user.update({
    where: { email: session.user.email },
    data: { twoFactorEnabled: true },
  });

  return NextResponse.json({ success: true });
}
