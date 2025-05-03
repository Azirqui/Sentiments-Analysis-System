import { PrismaAdapter } from "@auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import  prisma  from "@/lib/prisma"
import { compare } from "bcryptjs"
import { logAuthEvent } from "@/lib/audit"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    // Short session lifetime for security (4 hours)
    maxAge: 4 * 60 * 60, // 4 hours
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          return null
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error("Email not verified. Please verify your email first.")
        }

        // Check password
        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          // Log failed login attempt
          await logAuthEvent({
            userId: user.id,
            type: "LOGIN",
            ip: (req.headers?.["x-forwarded-for"] as string) || "unknown",
            userAgent: req.headers?.["user-agent"] || "unknown",
            status: "FAILED",
            details: "Invalid password",
          })

          return null
        }

        // Log successful login
        await logAuthEvent({
          userId: user.id,
          type: "LOGIN",
          ip: (req.headers?.["x-forwarded-for"] as string) || "unknown",
          userAgent: req.headers?.["user-agent"] || "unknown",
          status: "SUCCESS",
        })

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    // async session({ session, token }) {
    //   if (token && session.user) {
    //     session.user.id = token.id as string
    //   }
    //   return session
    // },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string
      }
      return session
    },
  },
  events: {
    async signOut({ token }) {
      if (token.id) {
        await logAuthEvent({
          userId: token.id as string,
          type: "LOGOUT",
          ip: "unknown", // In a real app, you'd get this from the request
          userAgent: "unknown", // In a real app, you'd get this from the request
          status: "SUCCESS",
        })
      }
    },
  },
}
