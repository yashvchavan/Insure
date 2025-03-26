"use client"

import type React from "react"
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { RegisterRequest, RegisterResponse } from '../../types/register';

export default function UserRegisterPage() {
  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const router = useRouter()
  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const payload: RegisterRequest = {
      username,
      name: fullName,
      email,
      password,
      phone,
    };
  
    console.log('Sending payload:', payload);
  
    try {
      const response = await axios.post<RegisterResponse>('/api/register', payload);
      console.log('User Registered:', response.data);
      router.push('/user-login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Registration Failed:', error.response?.data?.message || error.message);
      } else {
        console.error('Registration Failed:', error);
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>User Registration</CardTitle>
            <CardDescription>Create a new account to access our services</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  
                  placeholder="Enter your Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Choose a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Link href="/user-login" className="text-sm text-primary hover:underline">
                Already have an account? Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

