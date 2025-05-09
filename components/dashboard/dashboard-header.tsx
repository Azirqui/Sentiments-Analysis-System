// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { signOut } from "next-auth/react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Menu, User, Settings, LogOut } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { useMobile } from "@/hooks/use-mobile";

// type UserType = {
//   id: string;
//   name?: string | null;
//   email?: string | null;
//   image?: string | null;
// };

// type DashboardHeaderProps = {
//   user: UserType;
// };

// export function DashboardHeader({ user }: DashboardHeaderProps) {
//   const { toast } = useToast();
//   const isMobile = useMobile();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const handleSignOut = async () => {
//     try {
//       // Call the server-side force-logout endpoint (optional, as signOut may suffice)
//       const res = await fetch("/api/auth/force-logout", { method: "POST" });
//       if (!res.ok) throw new Error("Failed to logout");

//       // Show toast
//       toast({
//         title: "Signed out",
//         description: "You have been signed out successfully",
//       });

//       // Sign out using NextAuth client-side
//       await signOut({ callbackUrl: "/" });
//     } catch (error) {
//       console.error("Logout error:", error);
//       // Fallback to redirect if something goes wrong
//       window.location.href = "/";
//     }
//   };

//   const getInitials = (name?: string | null) => {
//     if (!name) return "U";
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .substring(0, 2);
//   };

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container flex h-16 items-center justify-between">
//       <div className="flex items-center gap-2">
//          {isMobile && (
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
//               <DropdownMenuItem onClick={handleSignOut}>
//                 <LogOut className="mr-2 h-4 w-4" />
//                 <span>Log out</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         )}
//       </div>
//     </header>
//   );
// }
"use client"

import { useState } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X, Heart, User, Settings, LogOut } from "lucide-react"

type UserType = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

type HeaderProps = {
  user?: UserType | null
}

export function DashboardHeader({ user }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { toast } = useToast()
  const isMobile = useMobile()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/force-logout", { method: "POST" })
      if (!res.ok) throw new Error("Failed to logout")
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      })
      await signOut({ callbackUrl: "/" })
    } catch {
      window.location.href = "/"
    }
  }

  const getInitials = (name?: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-black"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <span className="text-xl font-bold text-black">HeartPredict</span>
        </Link>

        <nav className="hidden md:flex space-x-6 items-center">
          <Link href="/home" className="text-gray-700 hover:text-black font-medium">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-black font-medium">
            About Us
          </Link>
          <Link href="/predict" className="text-gray-700 hover:text-black font-medium">
            Prediction Test
          </Link>
          <Button className="bg-black hover:bg-opacity-90">
            <Link href="/safety-measures" className="flex items-center gap-1 text-white">
              <Heart className="h-4 w-4" />
              <span>Safety Measures</span>
            </Link>
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button className="md:hidden text-gray-700" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4">
          <Link href="/home" className="block text-gray-700 hover:text-black font-medium" onClick={toggleMenu}>
            Home
          </Link>
          <Link href="/about" className="block text-gray-700 hover:text-black font-medium" onClick={toggleMenu}>
            About Us
          </Link>
          <Link href="/predict" className="block text-gray-700 hover:text-black font-medium" onClick={toggleMenu}>
            Prediction Test
          </Link>
          <Button className="w-full bg-black hover:bg-opacity-90">
            <Link href="/safety-measures" className="flex items-center justify-center gap-1 text-white" onClick={toggleMenu}>
              <Heart className="h-4 w-4" />
              <span>Safety Measures</span>
            </Link>
          </Button>

          {user && (
            <>
              <Link href="/profile" className="block text-gray-700 hover:text-black font-medium" onClick={toggleMenu}>
                Profile
              </Link>
              <Link href="/settings" className="block text-gray-700 hover:text-black font-medium" onClick={toggleMenu}>
                Settings
              </Link>
              <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
