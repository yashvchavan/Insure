"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { FileTextIcon, BellIcon, User, Loader2, RefreshCw } from "lucide-react";
import ChatbotButton from "@/components/ChatbotButton";
import Link from "next/link";
import useAuth from "@/context/store";
import { Button } from "@/components/ui/button";

interface Policy {
  _id: string;
  policyId: string;
  name: string;
  type: string;
  premium: string;
  renewalDate: string;
  status: string;
  coverageAmount?: string;
  startDate?: string;
}

const activityData = [
  { name: "Jan", claims: 4, renewals: 2 },
  { name: "Feb", claims: 3, renewals: 5 },
  { name: "Mar", claims: 2, renewals: 3 },
  { name: "Apr", claims: 5, renewals: 4 },
  { name: "May", claims: 1, renewals: 6 },
  { name: "Jun", claims: 3, renewals: 2 },
];

const notifications: { id: number; title: string; message: string; date: string; }[] = [];

// Helper function to calculate renewal date (1 year from start date)
const calculateRenewalDate = (startDate: string) => {
  if (!startDate) return "N/A";
  const date = new Date(startDate);
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
};

// Helper function for policy distribution chart
const getPolicyDistributionData = (policies: Policy[]) => {
  const typeCounts = policies.reduce((acc, policy) => {
    acc[policy.type] = (acc[policy.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
  
  return Object.entries(typeCounts).map(([name, value], index) => ({
    name,
    value,
    color: colors[index % colors.length]
  }));
};

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [renewingPolicy, setRenewingPolicy] = useState<string | null>(null);
  const [claims, setClaims] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const { user } = useAuth() as { user: { username: string ,id:string} | null } || { user: null };
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/user-login");
    } else if (user) {
      fetchApprovedPolicies();
      fetchUserClaims();
    }
  }, [user, router]);

  const fetchApprovedPolicies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user-policies?userId=${user?.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.policies) {
        throw new Error("No policies data received");
      }

      setPolicies(data.policies);
    } catch (error) {
      console.error("Failed to load policies:", error);
      console.error("Failed to load policies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRenewPolicy = (policyId: string) => {
    setRenewingPolicy(policyId);
    router.push(`/renew-policy?policyId=${policyId}`);
  };

  const fetchUserClaims = async () => {
    try {
      const response = await fetch(`/api/user-claims?userId=${user?.id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setClaims(data.claims || []);
    } catch (error) {
      console.error("Failed to load claims:", error);
    }
  };

  // Helper to get last 6 months labels
  const getLast6Months = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        name: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        month: d.getMonth(),
      });
    }
    return months;
  };

  // Aggregate claims and renewals by month
  useEffect(() => {
    const months = getLast6Months();
    // Claims aggregation
    const claimsByMonth: Record<string, number> = {};
    claims.forEach((claim) => {
      if (!claim.createdAt) return;
      const date = new Date(claim.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      claimsByMonth[key] = (claimsByMonth[key] || 0) + 1;
    });
    // Renewals aggregation
    const renewalsByMonth: Record<string, number> = {};
    policies.forEach((policy) => {
      const dateStr = policy.renewalDate || policy.startDate;
      if (!dateStr) return;
      const date = new Date(dateStr);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      renewalsByMonth[key] = (renewalsByMonth[key] || 0) + 1;
    });
    // Build activity data for chart
    const activity = months.map(({ name, year, month }) => {
      const key = `${year}-${month}`;
      return {
        name,
        claims: claimsByMonth[key] || 0,
        renewals: renewalsByMonth[key] || 0,
      };
    });
    setActivityData(activity);
  }, [claims, policies]);

  

  if (!user) {
    return null; // The useEffect will handle the redirect
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">{"Welcome " + user?.username || "User Dashboard"}</h1>
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
                  {policies.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getPolicyDistributionData(policies)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {getPolicyDistributionData(policies).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No policy data available
                    </div>
                  )}
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
                  {notifications.length === 0 ? (
                    <div className="flex items-center justify-center h-20 text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start p-3 rounded-lg border">
                        <BellIcon className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies">
            <Card>
              <CardHeader>
                <CardTitle>My Policies</CardTitle>
                <CardDescription>Your approved insurance policies</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : policies.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No approved policies found. Your applications will appear here once approved.
                    </p>
                    <Link href="/policy/health" className="mt-4 inline-block">
                      <Button variant="default">Apply for a Policy</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {policies.map((policy) => (
                      <div key={policy._id} className="flex flex-col md:flex-row justify-between items-center p-4 rounded-lg border">
                        <div className="flex-1">
                          <h4 className="font-medium">{policy.name}</h4>
                          <p className="text-sm text-muted-foreground">Type: {policy.type}</p>
                          {policy.coverageAmount && (
                            <p className="text-sm text-muted-foreground">
                              Coverage: {policy.coverageAmount}
                            </p>
                          )}
                        </div>
                        <div className="mt-2 md:mt-0 md:text-right">
                          <p className="text-sm">Premium: {policy.premium}</p>
                          <p className="text-sm">Renewal: {calculateRenewalDate(policy.startDate || policy.renewalDate)}</p>
                        </div>
                        <div className="mt-2 md:mt-0 flex items-center gap-2 md:pl-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {policy.status}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRenewPolicy(policy._id)}
                            disabled={renewingPolicy === policy._id}
                          >
                            {renewingPolicy === policy._id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <RefreshCw className="h-4 w-4 mr-2" />
                            )}
                            Renew
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Keep Claims and Documents sections unchanged */}
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
                      <p>no claims found</p>
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