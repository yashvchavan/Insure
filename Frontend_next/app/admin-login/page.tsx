"use client"

import type React from "react"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-toastify";
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" 
import { Label } from "@/components/ui/label"
import { AdminLoginRequest } from '@/types/adminLogin';

import useAuth from "@/context/store";


export default function AdminLoginPage() {
  const { useAuthlogin } = useAuth();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false); 
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const payload: AdminLoginRequest = {
      email,
      password,
    };
  
    try {
      setLoading(true);
      const response = await axios.post('/api/admin-login', payload, {
        withCredentials: true,
      });
  
      // Store admin info in Zustand
      useAuth.getState().useAuthlogin({
        ...response.data.admin,
        role: 'admin' // Ensure role is set
      });
      useAuth.getState().setAdminEmail(email); // Explicitly set admin email
  
      toast.success('Login successful! Redirecting...');
      router.push('/admin-dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Link href="/admin-register" className="text-sm text-primary hover:underline">
                Don't have an account? Register
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}