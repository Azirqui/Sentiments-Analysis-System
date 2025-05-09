import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TwoFactorSetup } from "@/components/profile/two-factor-setup"
import  prisma from "@/lib/prisma"
import { getBackupCodes } from "@/lib/two-factor"

export default async function SecurityPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  // Get user with 2FA status
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      twoFactorEnabled: true,
    },
  })

  if (!user) {
    redirect("/auth/login")
  }

  // Get backup codes if 2FA is enabled
  let backupCodes = []
  if (user.twoFactorEnabled) {
    backupCodes = await getBackupCodes(user.id)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <DashboardHeader user={session.user} />
      <main className="container mx-auto py-6 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Security Settings</h1>

          <div className="space-y-6">
            <TwoFactorSetup
              userId={user.id}
              twoFactorEnabled={user.twoFactorEnabled}
              existingBackupCodes={backupCodes}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
