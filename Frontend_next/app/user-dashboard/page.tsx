"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { FileTextIcon, BellIcon, User } from "lucide-react";
import ChatbotButton from "@/components/ChatbotButton";
import Link from "next/link";
import useAuth from "@/context/store";

const policyData = [
  { name: "Health", value: 40, color: "#FF6384" },
  { name: "Vehicle", value: 30, color: "#36A2EB" },
  { name: "Life", value: 20, color: "#FFCE56" },
  { name: "Home", value: 10, color: "#4BC0C0" },
];

const activityData = [
  { name: "Jan", claims: 4, renewals: 2 },
  { name: "Feb", claims: 3, renewals: 5 },
  { name: "Mar", claims: 2, renewals: 3 },
  { name: "Apr", claims: 5, renewals: 4 },
  { name: "May", claims: 1, renewals: 6 },
  { name: "Jun", claims: 3, renewals: 2 },
];

const notifications = [
  { id: 1, title: "Policy Renewal", message: "Your health policy is due for renewal in 15 days", date: "2023-06-15" },
  { id: 2, title: "Claim Update", message: "Your vehicle claim has been approved", date: "2023-06-10" },
  { id: 3, title: "New Document", message: "A new document has been added to your vault", date: "2023-06-05" },
];

const policies = [
  {
    id: 1,
    name: "Health Gold Plan",
    type: "Health",
    premium: "$120/month",
    renewalDate: "2023-07-15",
    status: "Active",
  },
  {
    id: 2,
    name: "Vehicle Comprehensive",
    type: "Vehicle",
    premium: "$80/month",
    renewalDate: "2023-08-22",
    status: "Active",
  },
  {
    id: 3,
    name: "Term Life Insurance",
    type: "Life",
    premium: "$150/month",
    renewalDate: "2023-09-10",
    status: "Active",
  },
];

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth() as { user: { username: string } | null } || { user: null };
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/user-login");
    }
  }, [user, router]);

  // If user is not logged in, don't render the dashboard
  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">{user?.username || "User Dashboard"}</h1>
          <Link href="/user-dashboard">
            <div className="flex items-center gap-2 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <User className="h-6 w-6" />
            </div>
          </Link>
        </div>

        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="policies">My Policies</TabsTrigger>
            <TabsTrigger value="claims">Claims</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Policy Distribution</CardTitle>
                  <CardDescription>Breakdown of your active policies</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={policyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {policyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Claims and renewals in the last 6 months</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="claims" fill="#FF6384" />
                      <Bar dataKey="renewals" fill="#36A2EB" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Your latest updates and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start p-3 rounded-lg border">
                      <BellIcon className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies">
            <Card>
              <CardHeader>
                <CardTitle>My Policies</CardTitle>
                <CardDescription>Manage your active insurance policies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {policies.map((policy) => (
                    <div key={policy.id} className="flex flex-col md:flex-row justify-between p-4 rounded-lg border">
                      <div>
                        <h4 className="font-medium">{policy.name}</h4>
                        <p className="text-sm text-muted-foreground">Type: {policy.type}</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <p className="text-sm">Premium: {policy.premium}</p>
                        <p className="text-sm">Renewal: {policy.renewalDate}</p>
                      </div>
                      <div className="mt-2 md:mt-0 flex items-center">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {policy.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claims">
            <Card>
              <CardHeader>
                <CardTitle>Claims Management</CardTitle>
                <CardDescription>Track and file insurance claims</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-muted/50">
                    <h3 className="font-medium mb-2">File a New Claim</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start the process to file a new insurance claim
                    </p>
                    <Link href="/claims">
                      <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
                        Start New Claim
                      </button>
                    </Link>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h3 className="font-medium mb-2">Recent Claims</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between p-2 rounded bg-muted/30">
                        <span>Vehicle Damage Claim</span>
                        <span className="text-amber-600">In Progress</span>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-muted/30">
                        <span>Health Insurance Claim</span>
                        <span className="text-green-600">Approved</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Document Vault</CardTitle>
                <CardDescription>Securely store and manage your important documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-muted/50">
                    <h3 className="font-medium mb-2">Upload New Document</h3>
                    <p className="text-sm text-muted-foreground mb-4">Add a new document to your secure vault</p>
                    <Link href="/vault">
                      <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
                        Upload Document
                      </button>
                    </Link>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h3 className="font-medium mb-2">Recent Documents</h3>
                    <div className="space-y-2">
                      <div className="flex items-center p-2 rounded bg-muted/30">
                        <FileTextIcon className="h-4 w-4 mr-2" />
                        <span>Health_Policy_Document.pdf</span>
                      </div>
                      <div className="flex items-center p-2 rounded bg-muted/30">
                        <FileTextIcon className="h-4 w-4 mr-2" />
                        <span>Vehicle_Insurance_Certificate.pdf</span>
                      </div>
                      <div className="flex items-center p-2 rounded bg-muted/30">
                        <FileTextIcon className="h-4 w-4 mr-2" />
                        <span>ID_Proof.jpg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Chatbot button */}
      <div className="fixed bottom-4 left-4 z-50">
        <ChatbotButton />
      </div>
    </div>
  );
}