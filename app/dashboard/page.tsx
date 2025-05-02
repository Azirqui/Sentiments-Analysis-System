import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuditLogList } from "@/components/dashboard/audit-log-list"
import { getUserAuditLogs } from "@/lib/audit"

export default async function DashboardPage() {
  type CustomSession = {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
  const session = await getServerSession(authOptions)  as CustomSession | null

  if (!session) {
    redirect("/auth/login")
  }

  const auditLogs = await getUserAuditLogs(session.user.id)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <DashboardHeader user={session.user} />
      <main className="container mx-auto py-6 px-4 space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {session.user.name}</CardTitle>
              <CardDescription>You are securely logged in</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Your account is protected with our Zero Trust security architecture.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentication Audit Log</CardTitle>
              <CardDescription>Recent authentication events</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <AuditLogList logs={auditLogs} /> */}
              <AuditLogList logs={auditLogs.map(log => ({
  ...log,
  status: log.status === "SUCCESS" || log.status === "FAILED" ? log.status : "FAILED"
}))} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
