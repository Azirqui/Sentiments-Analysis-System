import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
// import { SecurityHeaders } from "@/components/security-headers"
import { AuthDebugger } from "@/components/debug/auth-debugger"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Secure Auth System",
  description: "Next.js application with secure authentication",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <SecurityHeaders /> */}
      <head>
        {/* Force no-cache for development to prevent stale CSS */}
        {process.env.NODE_ENV === 'development' && (
          <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        )}
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster />
            <AuthDebugger />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
