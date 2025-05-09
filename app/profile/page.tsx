import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileForm } from "@/components/profile/profile-form"
import { getUserById } from "@/lib/user"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  const user = await getUserById(session.user.id)

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <DashboardHeader user={session.user} />
      <main className="container mx-auto py-6 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
          <ProfileForm user={user} />
        </div>
      </main>
    </div>
  )
}
