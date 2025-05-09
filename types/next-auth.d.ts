// types/next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      requiresTwoFactor: boolean
      twoFactorVerified: {}
      setupTwoFactor: boolean
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email?: string | null
    requiresTwoFactor?: boolean
  }
}
