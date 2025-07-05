"use client"

import { useState } from "react"
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
import useAuth from "@/context/store"
import Image from "next/image"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
  
      const data = await response.json();
  
      if (data.success) {
        logout();
        window.location.href = data.redirectTo;
      } else {
        console.error('Logout failed:', data.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCallSupport = () => {
    window.location.href = 'tel:123456789';
  };

  const handleEmailSupport = () => {
    window.location.href = 'mailto:abc@123';
  };

  const handleChatSupport = () => {
    window.location.href = '/chatbot';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/">
            
              <Image
                src="/images/logo.png"
                alt="Insure Logo"
                width={200}
                height={50}
                className="object-contain h-200 w-50"
                priority
              />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Account</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[100px] lg:w-[200px] lg:grid-cols-1">
                    <NavigationMenuItem>
                      <Link href="/user-login" className={navigationMenuTriggerStyle()}>
                        User Login
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/admin-login" className={navigationMenuTriggerStyle()}>
                        Admin Login
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/user-register" className={navigationMenuTriggerStyle()}>
                        Register
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <button onClick={handleLogout} className={navigationMenuTriggerStyle()}>
                        Logout
                      </button>
                    </NavigationMenuItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/claims" className={navigationMenuTriggerStyle()}>
                  Claims
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/vault" className={navigationMenuTriggerStyle()}>
                  Vault
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Support</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    <NavigationMenuItem>
                      <button onClick={handleCallSupport} className={navigationMenuTriggerStyle()}>
                        <Phone className="mr-2 h-4 w-4" />
                        Call Us: 123456789
                      </button>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <button onClick={handleEmailSupport} className={navigationMenuTriggerStyle()}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email Us: abc@123
                      </button>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <button onClick={handleChatSupport} className={navigationMenuTriggerStyle()}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat Support
                      </button>
                    </NavigationMenuItem>
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
                  <button onClick={handleCallSupport} className="block w-full text-left p-1 rounded-md hover:bg-muted">
                    Call Us: 123456789
                  </button>
                  <button onClick={handleEmailSupport} className="block w-full text-left p-1 rounded-md hover:bg-muted">
                    Email Us: abc@123
                  </button>
                  <button onClick={handleChatSupport} className="block w-full text-left p-1 rounded-md hover:bg-muted">
                    Chat Support
                  </button>
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