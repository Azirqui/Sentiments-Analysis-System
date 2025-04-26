import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getServerSession(authOptions)

  try {
    const session = await getServerSession(authOptions)

    if (session) {
      // If authenticated, redirect to dashboard
      redirect("/dashboard")
    }
  } catch (error) {
    console.error("Session check error:", error)
    // Don't redirect if there's an error, just show the login page
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md space-y-8 p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Secure Auth System</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            A secure authentication system built with Next.js and Auth.js
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/auth/register">Register</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
