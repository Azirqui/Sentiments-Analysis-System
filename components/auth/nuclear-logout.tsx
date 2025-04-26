// components/auth/nuclear-logout.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export function NuclearLogout() {
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)

    try {
      // Show toast first so user sees feedback
      toast({
        title: "Signing out",
        description: "Please wait...",
      })

      // 1. Clear all cookies (not just auth cookies)
      document.cookie.split(";").forEach(cookie => {
        const [name] = cookie.trim().split("=")
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
      })

      // 2. Clear localStorage and sessionStorage
      localStorage.clear()
      sessionStorage.clear()

      // 3. Wait a moment
      await new Promise(resolve => setTimeout(resolve, 500))

      // 4. Force a hard redirect to the correct login page
      // If your login page is at the root, use "/"
      window.location.href = "/"  // Change this to "/auth/login" if that's your login page
    } catch (error) {
      console.error("Logout error:", error)
      
      // If all else fails, force redirect
      window.location.href = "/"  // Change this to "/auth/login" if that's your login page
    }
  }

  return (
    <Button 
      variant="outline" 
      className="w-full justify-start" 
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isLoggingOut ? "Signing out..." : "Sign out"}
    </Button>
  )
}