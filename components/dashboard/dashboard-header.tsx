// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { signOut } from "next-auth/react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Menu, User, Settings, LogOut } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { useMobile } from "@/hooks/use-mobile"
// import router from "next/router"
// import { LogoutHandler } from "@/components/auth/logout-handler"
// import { ForceLogout } from "@/components/auth/force-logout"
// import { logout } from "./logout";
// type UserType = {
//   id: string
//   name?: string | null
//   email?: string | null
//   image?: string | null
// }

// type DashboardHeaderProps = {
//   user: UserType
// }

// export function DashboardHeader({ user }: DashboardHeaderProps) {
//   const { toast } = useToast()
//   const isMobile = useMobile()
//   const [isMenuOpen, setIsMenuOpen] = useState(false)

// //   const handleSignOut = async () => {
// //     try {
// //       const res = await fetch("/api/auth/force-logout", { method: "POST" })
// //     if (!res.ok) throw new Error("Failed to logout")
// // // Show toast
// //       toast({
// //         title: "Signed out",
// //         description: "You have been signed out successfully",
// //       });
// //       await signOut()
// //       await logout();
// //   //  "use server"
// //   //   await signOut({ callbackUrl: "/" }) // clears client cache + redirects


// //       // Wait a moment for the toast to be visible
// //       // console.log("Waiting before redirect...");
// //       // setTimeout(() => {
// //       //   console.log("Redirecting to login...");
// //       //   window.location.href = "";
// //       // }, 1500);
// //     } catch (error) {
// //       console.error("Logout error:", error);
// //       window.location.href = "/";
// //     }
// //   };
// const handleSignOut = async () => {
//   try {
//     const res = await fetch("/api/auth/force-logout", { method: "POST" });

//     if (!res.ok) throw new Error("Failed to logout");

//     // Show a toast first
//     toast({
//       title: "Signed out",
//       description: "You have been signed out successfully",
//     });

//     // Wait a little bit for user to see toast
//     await new Promise((resolve) => setTimeout(resolve, 3000));

//     // Then actually sign out (this triggers a redirect)
//     await signOut({ callbackUrl: "/" });

//   } catch (error) {
//     console.error("Logout error:", error);
//     window.location.href = "/";
//   }
// };
//   const getInitials = (name?: string | null) => {
//     if (!name) return "U"
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .substring(0, 2)
//   }

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container flex h-16 items-center justify-between">
//         <div className="flex items-center gap-2">
//           {isMobile && (
//             <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
//               <Menu className="h-5 w-5" />
//               <span className="sr-only">Toggle menu</span>
//             </Button>
//           )}
//           <Link href="/dashboard" className="flex items-center space-x-2">
//             <span className="font-bold text-xl">SecureAuth</span>
//           </Link>
//         </div>

//         <nav
//           className={`${isMobile ? (isMenuOpen ? "absolute top-16 left-0 right-0 border-b bg-background p-4 flex flex-col space-y-2" : "hidden") : "flex items-center space-x-4"}`}
//         >
//           {!isMobile && (
//             <>
//               <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
//                 Dashboard
//               </Link>
//               <Link href="/profile" className="text-sm font-medium transition-colors hover:text-primary">
//                 Profile
//               </Link>
//             </>
//           )}

//           {isMobile && isMenuOpen && (
//             <>
//               <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary py-2">
//                 Dashboard
//               </Link>
//               <Link href="/profile" className="text-sm font-medium transition-colors hover:text-primary py-2">
//                 Profile
//               </Link>
//               <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
//                 <LogOut className="mr-2 h-4 w-4" />
//                 Sign out
//               </Button>
//             </>
//           )}
//         </nav>

//         {!isMobile && (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//                 <Avatar className="h-8 w-8">
//                   <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
//                   <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-56" align="end" forceMount>
//               <DropdownMenuLabel className="font-normal">
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium leading-none">{user.name}</p>
//                   <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem asChild>
//                 <Link href="/profile">
//                   <User className="mr-2 h-4 w-4" />
//                   <span>Profile</span>
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <Link href="/settings">
//                   <Settings className="mr-2 h-4 w-4" />
//                   <span>Settings</span>
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               {/* <DropdownMenuItem onClick={handleSignOut}>
//                 <LogOut className="mr-2 h-4 w-4" />
//                 <span>Log out</span>
//               </DropdownMenuItem> */}
//               <DropdownMenuItem asChild>
//                 <LogoutHandler />               
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         )}
//       </div>
//     </header>
//   )
// }
"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, User, Settings, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";

type UserType = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type DashboardHeaderProps = {
  user: UserType;
};

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const { toast } = useToast();
  const isMobile = useMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      // Call the server-side force-logout endpoint (optional, as signOut may suffice)
      const res = await fetch("/api/auth/force-logout", { method: "POST" });
      if (!res.ok) throw new Error("Failed to logout");

      // Show toast
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });

      // Sign out using NextAuth client-side
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback to redirect if something goes wrong
      window.location.href = "/";
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
      <div className="flex items-center gap-2">
         {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-xl">SecureAuth</span>
          </Link>
        </div>
        <nav
          className={`${isMobile ? (isMenuOpen ? "absolute top-16 left-0 right-0 border-b bg-background p-4 flex flex-col space-y-2" : "hidden") : "flex items-center space-x-4"}`}
        >
          {!isMobile && (
            <>
              <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                Dashboard
              </Link>
              <Link href="/profile" className="text-sm font-medium transition-colors hover:text-primary">
                Profile
              </Link>
            </>
          )}

          {isMobile && isMenuOpen && (
            <>
              <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary py-2">
                Dashboard
              </Link>
              <Link href="/profile" className="text-sm font-medium transition-colors hover:text-primary py-2">
                Profile
              </Link>
              <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </>
          )}
        </nav>


        {!isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}