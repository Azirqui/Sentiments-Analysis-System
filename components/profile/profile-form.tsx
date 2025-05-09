"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TriangleIcon as ExclamationTriangleIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

type FormValues = z.infer<typeof formSchema>

type User = {
  id: string
  name: string | null
  email: string | null
  emailVerified: Date | null
  image: string | null
  createdAt: Date
  updatedAt: Date
}

type ProfileFormProps = {
  user: User
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update profile")
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })

      router.refresh()
    } catch (error) {
      console.error("Profile update error:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your account profile information</CardDescription>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            <strong>Email:</strong> {user.email}
          </div>
          <div className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            {user.emailVerified ? "Verified" : "Unverified"}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
