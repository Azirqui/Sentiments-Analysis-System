// components/auth/force-logout.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export function ForceLogout() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)

    try {
      // 1. Clear all auth-related cookies
      const cookiesToClear = [
        "next-auth.session-token",
        "next-auth.csrf-token",
        "next-auth.callback-url",
        "__Secure-next-auth.session-token",
        "__Secure-next-auth.csrf-token",
        "__Host-next-auth.csrf-token"
      ]

      cookiesToClear.forEach(name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
      })

      // 2. Call our API to clear server-side session
      await fetch("/api/auth/force-logout", { method: "POST" })

      // 3. Show toast notification
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      })

      // 4. Wait a moment for the toast to be visible
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 5. Force a hard redirect to the login page
      window.location.href = "/auth/login"
    } catch (error) {
      console.error("Logout error:", error)
      setIsLoggingOut(false)
      
      // If all else fails, force redirect
      window.location.href = "/auth/login"
    }
  }

  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start" 
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isLoggingOut ? "Signing out..." : "Sign out"}
    </Button>
  )
}