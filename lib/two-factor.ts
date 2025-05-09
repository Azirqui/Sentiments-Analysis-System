import * as speakeasy from "speakeasy"
import * as QRCode from "qrcode"
import prisma from "@/lib/prisma"
import crypto from 'crypto'

// --- AES CONFIG ---
const ENCRYPTION_KEY = Buffer.from(process.env.AES_SECRET_KEY!, 'hex') // 32 bytes key
const IV = Buffer.from(process.env.AES_IV!, 'hex') // 16 bytes IV

function encrypt(text: string): string {
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

export function decrypt(encryptedText: string): string {
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, IV)
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
// --- Generate and Store 2FA Secret ---
export async function generateTwoFactorSecret(userId: string, email: string) {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } })
  console.log("Existing user:", userId)

  if (!existingUser) {
    throw new Error(`User with ID ${userId} not found.`)
  }

  const secret = speakeasy.generateSecret({
    name: `SecureAuth:${email}`,
  })

  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || "")

  const encryptedSecret = encrypt(secret.base32)

  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorSecret: encryptedSecret,
      twoFactorEnabled: true,
    },
  })

  return {
    secret: secret.base32,
    qrCodeUrl,
  }
}

// --- Verify TOTP Token ---
export function verifyTwoFactorToken(encryptedSecret: string, token: string) {
  try {
    const decryptedSecret = decrypt(encryptedSecret)

    return speakeasy.totp.verify({
      secret: decryptedSecret,
      encoding: 'base32',
      token,
      window: 1,
    })
  } catch (error) {
    console.error("Error verifying TOTP token:", error)
    return false
  }
}
// export async function generateTwoFactorSecret(userId: string, email: string) {
//   // Check if user exists first
//   const existingUser = await prisma.user.findUnique({
//     where: { id: userId },
//   })
//   console.log("Existing user:", userId 

//   )
//   if (!existingUser) {
//     throw new Error(`User with ID ${userId} not found.`)
//   }

//   // Generate a new secret
//   const secret = speakeasy.generateSecret({
//     name: `SecureAuth:${email}`, // This shows up in the authenticator app
//   })

//   // Generate QR code as data URL
//   const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || "")

//   // Store the secret in the database (but don't enable 2FA yet)
//   await prisma.user.update({
//     where: { id: userId },
//     data: {
//       twoFactorSecret: secret.base32,
//       twoFactorEnabled: true,
//     },
//   })

//   return {
//     secret: secret.base32,
//     qrCodeUrl,
//   }
// }

// // Verify a TOTP token
// export function verifyTwoFactorToken(secret: string, token: string) {
//   try {
//     return speakeasy.totp.verify({
//       secret ,
//       encoding: "base32",
//       token,
//       window: 1, // Allow 1 step before and after for time drift (30 seconds each)
//     })
//   } catch (error) {
//     console.error("Error verifying TOTP token:", error)
//     return false
//   }
// }

// Enable 2FA for a user after verification
export async function enableTwoFactor(userId: string) {
  // Generate backup codes
  const backupCodes = Array(8)
    .fill(0)
    .map(() => Math.random().toString(36).substring(2, 8).toUpperCase())

  // Update user to enable 2FA
  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: true,
    },
  })

  // Delete any existing backup codes
  await prisma.backupCode.deleteMany({
    where: { userId },
  })

  // Create backup codes in the separate table
  for (const code of backupCodes) {
    await prisma.backupCode.create({
      data: {
        userId,
        code,
      },
    })
  }

  return backupCodes
}

// Disable 2FA for a user
export async function disableTwoFactor(userId: string) {
  // Update user to disable 2FA
  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
    },
  })

  // Delete all backup codes
  await prisma.backupCode.deleteMany({
    where: { userId },
  })
}

// Verify a backup code
export async function verifyBackupCode(userId: string, code: string) {
  try {
    // Find the backup code
    const backupCode = await prisma.backupCode.findFirst({
      where: {
        userId,
        code,
        used: false,
      },
    })

    if (!backupCode) {
      return false
    }

    // Mark the backup code as used
    await prisma.backupCode.update({
      where: { id: backupCode.id },
      data: { used: true },
    })

    return true
  } catch (error) {
    console.error("Error verifying backup code:", error)
    return false
  }
}

// Get all backup codes for a user
export async function getBackupCodes(userId: string) {
  const backupCodes = await prisma.backupCode.findMany({
    where: {
      userId,
      used: false,
    },
    select: {
      code: true,
    },
  })

  return backupCodes.map((bc) => bc.code)
}
