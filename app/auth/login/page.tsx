import { LoginForm } from "@/components/auth/login-form"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  // Define a custom session type that includes id

  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect("/home")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
