"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TriangleIcon as ExclamationTriangleIcon, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const formSchema = z.object({
  token: z.string().length(6, "Verification code must be 6 digits"),
})

type FormValues = z.infer<typeof formSchema>

type TwoFactorSetupProps = {
  userId: string
  twoFactorEnabled: boolean
  existingBackupCodes?: string[]
  onSetupComplete?: () => void
}

export function TwoFactorSetup({
  userId,
  twoFactorEnabled,
  existingBackupCodes = [],
  onSetupComplete,
}: TwoFactorSetupProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [setupStep, setSetupStep] = useState<"initial" | "qrcode" | "verify" | "complete">(
    twoFactorEnabled ? "complete" : "initial",
  )
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [backupCodes, setBackupCodes] = useState<string[]>(existingBackupCodes || [])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: "",
    },
  })

  async function startSetup() {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/two-factor/setup")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Setup failed")
      }

      const data = await response.json()
      setQrCodeUrl(data.qrCodeUrl)
      setSecret(data.secret)
      setSetupStep("qrcode")
    } catch (error) {
      console.error("2FA setup error:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      toast({
        variant: "destructive",
        title: "Setup failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/two-factor/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: data.token,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Verification failed")
      }

      const result = await response.json()

      if (result.backupCodes) {
        setBackupCodes(result.backupCodes)
      }

      toast({
        title: "Two-factor authentication enabled",
        description: "Your account is now more secure",
      })

      setSetupStep("complete")

      if (onSetupComplete) {
        onSetupComplete()
      }
    } catch (error) {
      console.error("2FA verification error:", error)
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

  async function disableTwoFactor() {
    setIsLoading(true)
    setError(null)

    try {
      const token = form.getValues("token")

      if (!token || token.length !== 6) {
        throw new Error("Please enter a valid 6-digit verification code")
      }

      const response = await fetch("/api/auth/two-factor/disable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Disabling 2FA failed")
      }

      toast({
        title: "Two-factor authentication disabled",
        description: "Your account security settings have been updated",
      })

      setSetupStep("initial")
      setBackupCodes([])
      form.reset()

      if (onSetupComplete) {
        onSetupComplete()
      }
    } catch (error) {
      console.error("2FA disable error:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      toast({
        variant: "destructive",
        title: "Failed to disable 2FA",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          {twoFactorEnabled
            ? "Your account is protected with two-factor authentication"
            : "Add an extra layer of security to your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {setupStep === "initial" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Two-factor authentication adds an additional layer of security to your account by requiring a code from
              your mobile device in addition to your password.
            </p>
            <Button onClick={startSetup} disabled={isLoading}>
              {isLoading ? "Setting up..." : "Set up two-factor authentication"}
            </Button>
          </div>
        )}

        {setupStep === "qrcode" && qrCodeUrl && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Scan QR Code</h3>
              <p className="text-sm text-muted-foreground">
                Scan this QR code with your authenticator app (like Google Authenticator, Authy, or Microsoft
                Authenticator).
              </p>
            </div>

            <div className="flex justify-center">
              <div className="border p-4 rounded-lg bg-white">
                <Image src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" width={200} height={200} />
              </div>
            </div>

            {secret && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Manual Entry</h3>
                <p className="text-sm text-muted-foreground">
                  If you can't scan the QR code, enter this code manually in your authenticator app:
                </p>
                <div className="font-mono bg-muted p-2 rounded text-center">{secret}</div>
              </div>
            )}

            <Button onClick={() => setSetupStep("verify")} className="w-full">
              Next
            </Button>
          </div>
        )}

        {setupStep === "verify" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Verify Setup</h3>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code from your authenticator app to verify the setup.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="token"
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
                  {isLoading ? "Verifying..." : "Verify and Enable"}
                </Button>
              </form>
            </Form>
          </div>
        )}

        {setupStep === "complete" && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Two-factor authentication is enabled</span>
            </div>

            {backupCodes.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Backup Codes</h3>
                <p className="text-sm text-muted-foreground">
                  Save these backup codes in a secure place. You can use them to sign in if you lose access to your
                  authenticator app.
                </p>
                <div className="bg-muted p-3 rounded grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="font-mono text-center">
                      {code}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Each code can only be used once. If you use a backup code, it will be invalidated.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Disable Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">
                If you want to disable two-factor authentication, enter a verification code from your authenticator app
                and click the button below.
              </p>

              <Form {...form}>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="token"
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

                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    disabled={isLoading}
                    onClick={disableTwoFactor}
                  >
                    {isLoading ? "Disabling..." : "Disable Two-Factor Authentication"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
