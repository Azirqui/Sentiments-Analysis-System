"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function LogoutHandler() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)

    try {
      console.log("Starting manual logout process...")

      // 1. Clear all auth-related cookies
      document.cookie.split(";").forEach(cookie => {
        const [name] = cookie.trim().split("=")
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
      })

      // 2. Show toast notification
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      })

      // 3. Wait a moment for the toast to be visible
      console.log("Waiting before redirect...")
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 4. Force a hard redirect to the login page
      console.log("Redirecting to login page...")
      window.location.href = "/auth/login"
    } catch (error) {
      console.error("Logout error:", error)
      setIsLoggingOut(false)
      
      // If all else fails, force redirect
      window.location.href = "/auth/login"
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex w-full items-center px-2 py-2 text-sm font-medium text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-2"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      {isLoggingOut ? "Signing out..." : "Sign out"}
    </button>
  )
}