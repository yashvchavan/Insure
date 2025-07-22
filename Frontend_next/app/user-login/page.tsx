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
import apiClient from '@/services/apiClient';
import { LoginRequest, LoginResponse } from '@/types/login';

import { generateTokens, setAuthCookies } from '@/services/authService';
export default function UserLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // Essential for cookies
      });
  
      const data = await response.json();
      
      if (response.ok) {
        // 1. Update Zustand store
        login(data.user);
        
        // 2. Store token in localStorage/sessionStorage if needed
        if (data.token) {
          sessionStorage.setItem('auth_token', data.token);
        }
        
        // 3. Force full page reload to ensure all auth state is initialized
        window.location.href = '/';
      } else {
        setError(data.message || 'Login failed');
        setIsLoading(false)
      }
    } catch (err) {
      setError('Network error - please try again');
      setIsLoading(false)
      console.error('Login error:', err);
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span className="ml-2">Logging in...</span>
                  </div>
                ) : 'Login'}
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

