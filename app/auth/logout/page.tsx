// "use client"

// import { useEffect } from "react"
// import { useRouter } from "next/navigation"

// export default function LogoutPage() {
//   const router = useRouter()

//   useEffect(() => {
//     // Clear all cookies
//     document.cookie.split(";").forEach((cookie) => {
//       const [name] = cookie.trim().split("=")
//       document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
//     })

//     // Redirect to login
//     router.push("/auth/login")
//   }, [router])

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center p-4">
//       <div className="w-full max-w-md space-y-8 p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg text-center">
//         <h1 className="text-2xl font-bold">Signing out...</h1>
//         <p>Please wait while we sign you out.</p>
//       </div>
//     </div>
//   )
// }

// app/auth/logout/page.tsx
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function LogoutPage() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions)
  
  // If not authenticated, redirect to login
  if (!session) {
    redirect("/auth/login")
  }
  
  // If authenticated, show logout page
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold">Signing out...</h1>
        <p>Please wait while we sign you out.</p>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Clear cookies
              const cookiesToClear = [
                "next-auth.session-token",
                "next-auth.csrf-token",
                "next-auth.callback-url",
                "__Secure-next-auth.session-token",
                "__Secure-next-auth.csrf-token",
                "__Host-next-auth.csrf-token"
              ];
              
              cookiesToClear.forEach(name => {
                document.cookie = \`\${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;\`;
              });
              
              // Redirect to login
              setTimeout(() => {
                window.location.href = "/auth/login";
              }, 1000);
            `
          }}
        />
      </div>
    </div>
  )
}