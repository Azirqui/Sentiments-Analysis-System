import { formatDistanceToNow } from "date-fns"
import { Shield, AlertTriangle } from "lucide-react"

type AuditLog = {
  id: string
  userId: string
  type: string
  ip: string
  userAgent: string
  status: "SUCCESS" | "FAILED"
  details?: string | null
  createdAt: Date
}

type AuditLogListProps = {
  logs: AuditLog[]
}

export function AuditLogList({ logs }: AuditLogListProps) {
  if (logs.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No authentication events found</div>
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div
          key={log.id}
          className="flex items-start space-x-3 p-3 rounded-md border bg-card text-card-foreground shadow-sm"
        >
          <div className="mt-0.5">
            {log.status === "SUCCESS" ? (
              <Shield className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{formatEventType(log.type)}</p>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {log.ip} • {formatUserAgent(log.userAgent)}
            </p>
            {log.details && <p className="text-xs text-muted-foreground">{log.details}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

function formatEventType(type: string): string {
  const typeMap: Record<string, string> = {
    LOGIN: "Login",
    LOGOUT: "Logout",
    REGISTER: "Registration",
    VERIFY_OTP: "Email Verification",
    RESEND_OTP: "Resend Verification Code",
    PROFILE_UPDATE: "Profile Update",
    PASSWORD_RESET: "Password Reset",
    PASSWORD_CHANGE: "Password Change",
  }

  return typeMap[type] || type
}

function formatUserAgent(userAgent: string): string {
  if (userAgent === "unknown") return "Unknown device"

  // Simple user agent parsing
  if (userAgent.includes("Mobile")) {
    return "Mobile device"
  } else if (userAgent.includes("Tablet")) {
    return "Tablet device"
  } else {
    return "Desktop device"
  }
}
