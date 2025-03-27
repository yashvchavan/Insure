"use client"

import { use, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ModeToggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { User, ChevronDown, FileText, Lock, Phone, Mail, MessageSquare, Bell, Menu, X } from "lucide-react"
import axios from "axios"
import useAuthlogout from "@/context/store"
import useAuth from "@/context/store"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      // Call the logout API
      const response = await axios.post("/api/logout");
  
      // Clear the authentication state using Zustand
      const { useAuthlogout } = useAuth.getState();
      useAuthlogout();
  
      console.log("User logged out successfully");
  
      // Redirect to the login page or home page
      if (response.data.redirectTo) {
        window.location.href = response.data.redirectTo; // Redirect to the specified URL
      } else {
        window.location.href = "/"; // Fallback to home page
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };



  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              className="h-8 w-8 rounded-full bg-primary flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Lock className="h-4 w-4 text-primary-foreground" />
            </motion.div>
            <span className="hidden font-bold sm:inline-block text-xl">INSURE</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Account</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[100px] lg:w-[200px] lg:grid-cols-1">
                    
                    <li>
                      <Link href="/user-login" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>User Login</NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin-login" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>Admin Login</NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/user-register" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>Register</NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout}>
                        <Link href="/" legacyBehavior passHref>
                          <NavigationMenuLink className={navigationMenuTriggerStyle()}>Logout</NavigationMenuLink>
                        </Link>
                      </button>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/claims" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Claims</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/vault" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Vault</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Support</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    <li>
                      <Link href="#" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          <Phone className="mr-2 h-4 w-4" />
                          Call Us
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="#" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          <Mail className="mr-2 h-4 w-4" />
                          Email Us
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="#" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Chat Support
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-auto">
                <DropdownMenuItem className="flex flex-col items-start">
                  <div className="font-medium">Policy Renewal</div>
                  <div className="text-sm text-muted-foreground">Your health policy is due for renewal in 15 days</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start">
                  <div className="font-medium">Claim Update</div>
                  <div className="text-sm text-muted-foreground">Your vehicle claim has been approved</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start">
                  <div className="font-medium">New Document</div>
                  <div className="text-sm text-muted-foreground">A new document has been added to your vault</div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />
        </div>

        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="container py-4 space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <Link href="/user-dashboard" className="flex items-center p-2 rounded-md hover:bg-muted">
                <User className="mr-2 h-5 w-5" />
                User Dashboard
              </Link>
              <Link href="/user-login" className="flex items-center p-2 rounded-md hover:bg-muted">
                <Lock className="mr-2 h-5 w-5" />
                User Login
              </Link>
              <Link href="/admin-login" className="flex items-center p-2 rounded-md hover:bg-muted">
                <Lock className="mr-2 h-5 w-5" />
                Admin Login
              </Link>
              <Link href="/user-register" className="flex items-center p-2 rounded-md hover:bg-muted">
                <User className="mr-2 h-5 w-5" />
                Register
              </Link>
              <Link href="/claims" className="flex items-center p-2 rounded-md hover:bg-muted">
                <FileText className="mr-2 h-5 w-5" />
                Claims
              </Link>
              <Link href="/vault" className="flex items-center p-2 rounded-md hover:bg-muted">
                <Lock className="mr-2 h-5 w-5" />
                Vault
              </Link>
              <div className="p-2 rounded-md hover:bg-muted">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Phone className="mr-2 h-5 w-5" />
                    Support
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="pl-7 mt-2 space-y-2">
                  <Link href="#" className="block p-1 rounded-md hover:bg-muted">
                    Call Us
                  </Link>
                  <Link href="#" className="block p-1 rounded-md hover:bg-muted">
                    Email Us
                  </Link>
                  <Link href="#" className="block p-1 rounded-md hover:bg-muted">
                    Chat Support
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <ModeToggle />
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}

