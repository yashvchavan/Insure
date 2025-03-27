"use client"

import { use, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";

import useAuth from "@/context/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, Download, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"

const policyData = [
  { month: "Jan", newPolicies: 65, renewals: 40, cancellations: 12 },
  { month: "Feb", newPolicies: 59, renewals: 45, cancellations: 10 },
  { month: "Mar", newPolicies: 80, renewals: 52, cancellations: 15 },
  { month: "Apr", newPolicies: 81, renewals: 56, cancellations: 14 },
  { month: "May", newPolicies: 56, renewals: 60, cancellations: 8 },
  { month: "Jun", newPolicies: 55, renewals: 50, cancellations: 9 },
];

const claimsData = [
  { month: "Jan", submitted: 45, approved: 30, rejected: 15 },
  { month: "Feb", submitted: 50, approved: 35, rejected: 15 },
  { month: "Mar", submitted: 60, approved: 40, rejected: 20 },
  { month: "Apr", submitted: 70, approved: 50, rejected: 20 },
  { month: "May", submitted: 65, approved: 45, rejected: 20 },
  { month: "Jun", submitted: 80, approved: 60, rejected: 20 },
];

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter()
  const { email } = useAuth();
  const [policies, setPolicies] = useState<
    { _id: number; name: string; category: string; subcribers:number;revenue:number,}[]
  >([]);
  const [users, setUsers] = useState<
    { id: number; name: string; email: string; policies: number; joined: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const successMessage = searchParams ? searchParams.get("success") : null;


  useEffect(() => {
    if (email) {
      fetchPolicies();
    }
  }, [email]);

  const fetchPolicies = async () => {
    try {
      console.log(email);
      const response = await axios.get(`/api/display-admin-policy?email=${email}`);
      setPolicies(response.data.admin || []);
      
      console.log("Policies:", response.data.admin);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching policies:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Policies:", policies);
  }, [policies]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-8 text-primary">Admin Dashboard</h1>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList
            className="grid w-full grid-cols-4 mb-8"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="claims">Claims</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">2,543</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="text-green-500">↑ 12%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Active Policies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">3,879</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="text-green-500">↑ 8%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">₹128,450</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="text-green-500">↑ 15%</span> from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Policy Statistics</CardTitle>
                <CardDescription>New policies, renewals, and cancellations over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={policyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="newPolicies" fill="#8884d8" name="New Policies" />
                    <Bar dataKey="renewals" fill="#82ca9d" name="Renewals" />
                    <Bar dataKey="cancellations" fill="#ff7c7c" name="Cancellations" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Claims Overview</CardTitle>
                <CardDescription>Submitted, approved, and rejected claims over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={claimsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="submitted" stroke="#8884d8" name="Submitted" />
                    <Line type="monotone" dataKey="approved" stroke="#82ca9d" name="Approved" />
                    <Line type="monotone" dataKey="rejected" stroke="#ff7c7c" name="Rejected" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Policy Management</CardTitle>
                    <CardDescription>Manage all insurance policies</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search policies..."
                        className="pl-8 w-full sm:w-[200px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Link href="/admin/add-policy">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Policy
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Subscribers</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>

                    {policies.map((policy) => (
                      <TableRow key={policy._id}>
                        <TableCell>{policy._id}</TableCell>
                        <TableCell>{policy.name}</TableCell>
                        <TableCell>{policy.category}</TableCell>
                        <TableCell>{policy.subcribers}</TableCell>
                        <TableCell>{policy.revenue}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claims">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Claims Management</CardTitle>
                    <CardDescription>Process and manage insurance claims</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="search" placeholder="Search claims..." className="pl-8 w-full sm:w-[200px]" />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Claim ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Policy</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>CL-1001</TableCell>
                      <TableCell>John Doe</TableCell>
                      <TableCell>Health Gold Plan</TableCell>
                      <TableCell>₹1,200</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">Pending</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                          <Button variant="default" size="sm">
                            Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>CL-1002</TableCell>
                      <TableCell>Jane Smith</TableCell>
                      <TableCell>Vehicle Comprehensive</TableCell>
                      <TableCell>₹3,500</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Approved</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>CL-1003</TableCell>
                      <TableCell>Robert Johnson</TableCell>
                      <TableCell>Home Insurance Plus</TableCell>
                      <TableCell>₹5,800</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Rejected</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Reopen
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage all platform users</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="search" placeholder="Search users..." className="pl-8 w-full sm:w-[200px]" />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Policies</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.policies}</TableCell>
                        <TableCell>{user.joined}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}