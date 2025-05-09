"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TriangleIcon as ExclamationTriangleIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  otp: z.string().length(6, "Verification code must be 6 digits"),
})

type FormValues = z.infer<typeof formSchema>

export function VerifyOtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const email = searchParams.get("email")

  useEffect(() => {
    if (!email) {
      router.push("/auth/login")
    }
  }, [email, router])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else {
      setCanResend(true)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdown, canResend])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  })

  async function onSubmit(data: FormValues) {
    if (!email) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: data.otp,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Verification failed")
      }

      toast({
        title: "Email verified",
        description: "Your email has been verified successfully",
      })

      // Redirect to login page
      router.push("/auth/login")
    } catch (error) {
      console.error("Verification error:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResendOtp() {
    if (!email || !canResend) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to resend verification code")
      }

      toast({
        title: "Code resent",
        description: "A new verification code has been sent to your email",
      })

      // Reset countdown
      setCountdown(60)
      setCanResend(false)
    } catch (error) {
      console.error("Resend OTP error:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      toast({
        variant: "destructive",
        title: "Failed to resend code",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!email) {
    return null
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Verify your email</CardTitle>
        <CardDescription>Enter the 6-digit code sent to {email}</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123456"
                      maxLength={6}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center">
          Didn&apos;t receive a code?{" "}
          {canResend ? (
            <Button variant="link" className="p-0 h-auto" onClick={handleResendOtp} disabled={isLoading}>
              Resend code
            </Button>
          ) : (
            <span className="text-muted-foreground">Resend code in {countdown}s</span>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
