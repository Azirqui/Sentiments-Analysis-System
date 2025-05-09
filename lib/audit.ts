import prisma from "@/lib/prisma"

type AuditEventParams = {
  userId: string
  type: string
  ip: string
  userAgent: string
  status: "SUCCESS" | "FAILED" | "INITIATED"
  details?: string
}

export async function logAuthEvent(params: AuditEventParams) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        type: params.type,
        ip: params.ip,
        userAgent: params.userAgent,
        status: params.status,
        details: params.details,
      },
    })
  } catch (error) {
    console.error("Failed to log audit event:", error)
  }
}

export async function getUserAuditLogs(userId: string, limit = 10) {
  try {
    return await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  } catch (error) {
    console.error("Failed to get user audit logs:", error)
    return []
  }
}
