import { PrismaAdapter } from "@auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import { compare } from "bcryptjs"
import { logAuthEvent } from "@/lib/audit"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 4 * 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        twoFactorVerified: { label: "2FA Verified", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            emailVerified: true,
            image: true,
            twoFactorEnabled: true,
            twoFactorSecret: true,
          },
        })

        if (!user) return null
        if (!user.emailVerified) throw new Error("Email not verified")

        // Bypass password check if 2FA was verified
        if (credentials.twoFactorVerified === "true") {
          await logAuthEvent({
            userId: user.id,
            type: "LOGIN_2FA",
            ip: req.headers?.["x-forwarded-for"] as string || "unknown",
            userAgent: req.headers?.["user-agent"] || "unknown",
            status: "SUCCESS",
          })

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            requiresTwoFactor: true,
            twoFactorVerified: true,
          }
        }

        // Validate password
        const isPasswordValid = await compare(credentials.password || "", user.password)
        if (!isPasswordValid) {
          await logAuthEvent({
            userId: user.id,
            type: "LOGIN",
            ip: req.headers?.["x-forwarded-for"] as string || "unknown",
            userAgent: req.headers?.["user-agent"] || "unknown",
            status: "FAILED",
            details: "Invalid password",
          })
          return null
        }

        // If 2FA is enabled, return partial session
        if (user.twoFactorEnabled) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            requiresTwoFactor: true,
            twoFactorVerified: false,
          }
        }

        // If 2FA not enabled, require setup
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          setupTwoFactor: true,
          twoFactorVerified: true,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.email = user.email

        token.requiresTwoFactor = (user as any).requiresTwoFactor ?? false
        token.setupTwoFactor = (user as any).setupTwoFactor ?? false
        token.twoFactorVerified = (user as any).twoFactorVerified ?? false
      }

      if (trigger === "update" && session?.twoFactorVerified === true) {
        token.requiresTwoFactor = false
        token.twoFactorVerified = true
      }

      return token
    },
    // async session({ session, token }) {
    //   if (token && session.user) {
    //     session.user.id = token.id as string
    //     session.user.twoFactorVerified = token.twoFactorVerified ?? false
    
    //     // Block access by stripping user info or setting a flag
    //     if (token.requiresTwoFactor && !token.twoFactorVerified) {
    //       return {
    //         ...session,
    //         user: {
    //           id: "",
    //           name: null,
    //           email: null,
    //           twoFactorVerified: false,
    //           requiresTwoFactor: true,
    //         },
    //       }
    //     }
    
    //     if (token.setupTwoFactor) {
    //       session.user.setupTwoFactor = true
    //     }
    //   }
    
    //   return session
    // }
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.twoFactorVerified = token.twoFactorVerified ?? false
        session.user.requiresTwoFactor = token.requiresTwoFactor ?? false
    
        if (token.setupTwoFactor) {
          session.user.setupTwoFactor = true
        }
      }
    
      return session
    }
    
    
  },
  events: {
    async signOut({ token }) {
      if (token.id) {
        await logAuthEvent({
          userId: token.id as string,
          type: "LOGOUT",
          ip: "unknown",
          userAgent: "unknown",
          status: "SUCCESS",
        })
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
}
