"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export function AuthDebugger() {
  const { data: session, status } = useSession()
  const [showDebug, setShowDebug] = useState(false)

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button onClick={() => setShowDebug(!showDebug)} className="bg-slate-800 text-white px-3 py-1 rounded-md text-xs">
        {showDebug ? "Hide Debug" : "Debug Auth"}
      </button>

      {showDebug && (
        <Card className="mt-2 w-80 max-h-96 overflow-auto">
          <CardHeader>
            <CardTitle className="text-sm">Auth Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs">
              <p>
                <strong>Status:</strong> {status}
              </p>
              <p>
                <strong>Session:</strong> {session ? "Yes" : "No"}
              </p>
              <pre className="mt-2 bg-slate-100 p-2 rounded overflow-auto">{JSON.stringify(session, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
