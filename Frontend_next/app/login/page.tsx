"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent, type: "user" | "admin") => {
    e.preventDefault()
    // Here you would typically handle the login logic
    console.log(`Logging in as ${type} with username: ${username}`)
    // For demo purposes, we'll just redirect to the respective dashboard
    if (type === "user") {
      router.push("/user-dashboard")
    } else {
      router.push("/admin-dashboard")
    }
  }

  return (
    <div className="container mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="user">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user">User Login</TabsTrigger>
                <TabsTrigger value="admin">Admin Login</TabsTrigger>
              </TabsList>
              <TabsContent value="user">
                <form onSubmit={(e) => handleLogin(e, "user")}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="admin">
                <form onSubmit={(e) => handleLogin(e, "admin")}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-username">Admin Username</Label>
                      <Input
                        id="admin-username"
                        placeholder="Enter admin username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Admin Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Enter admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Admin Login
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/forgot-password" className="text-sm text-muted-foreground hover:underline">
              Forgot password?
            </Link>
            <Link href="/register" className="text-sm text-muted-foreground hover:underline">
              Don't have an account? Register
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

