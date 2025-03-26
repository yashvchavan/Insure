"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { log } from "console"
import axios from "axios"
import useAuth from "@/context/store"

import { LoginRequest, LoginResponse } from '@/types/login';

export default function UserLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { useAuthlogin } = useAuth()
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: LoginRequest = {
      username,
      password,
    };

    try {
      const response = await axios.post<LoginResponse>('/api/login', payload, {
        withCredentials: true,
      });
      console.log('Login Response:', response.data);

      // Update the auth context with the logged-in user
      if (response.data.user) {
        useAuthlogin(response.data.user);
      }

      // Redirect to the home page after successful login
      router.push('/');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login Failed:', error.response?.data?.message || error.message);
      } else {
        console.error('Login Failed:', error);
      }
    }
  };
  return (
    <div className="container mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>User Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
            </form>
            <div className="mt-4 text-center">
              <Link href="/user-register" className="text-sm text-primary hover:underline">
                Don't have an account? Register
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

