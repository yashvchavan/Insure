"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios"; // Import Axios
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify"; // Optional: For showing success/error messages
import { AdminRegisterRequest } from '@/types/adminRegister';

export default function AdminRegisterPage() {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [insuranceTypes, setInsuranceTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast.error('You must accept the terms and conditions.');
      return;
    }

    const payload: AdminRegisterRequest = {
      companyName,
      email,
      phone,
      address,
      password,
      insuranceTypes,
      termsAndConditions: termsAccepted,
    };

    try {
      setLoading(true);
      const response = await axios.post('/api/admin-register', payload);
      console.log('Registration Response:', response.data);

      // Show success message
      toast.success('Registration successful! Redirecting...');

      // Redirect to the admin dashboard
      router.push('/admin-login');
    } catch (error: any) {
      console.error('Registration Failed:', error);
      toast.error(error.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Admin Registration</CardTitle>
            <CardDescription>Create a new admin account for your company</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Enter your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter company email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter company phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter company address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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

              {/* Multi-Select Checkbox for Insurance Types */}
              <div className="space-y-2">
                <Label>Types of Insurance</Label>
                <div className="flex flex-col space-y-2">
                  {['health', 'life', 'auto', 'home', 'business'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={insuranceTypes.includes(type)}
                        onCheckedChange={(checked) =>
                          setInsuranceTypes((prev) => (checked ? [...prev, type] : prev.filter((t) => t !== type)))
                        }
                      />
                      <Label htmlFor={type} className="capitalize">
                        {type} Insurance
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  required
                />
                <Label htmlFor="terms">I agree to the terms and conditions</Label>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link href="/admin-login" className="text-sm text-primary hover:underline">
                Already have an account? Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}