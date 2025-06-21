"use client"
import { X } from "lucide-react";
import { use, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";

// Disable static generation for this page
export const dynamic = 'force-dynamic';

interface Application {
  _id?: string;
  userId: string;
  policyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  occupation: string;
  employmentStatus: string;
  annualIncome: string;
  employerName?: string;
  yearsEmployed?: string;
  coverageAmount: string;
  startDate: string;
  paymentFrequency: string;
  existingConditions: string;
  additionalNotes?: string;
  agreeToTerms: boolean;
  allowCommunication: boolean;
  documents?: {
    [key: string]: {
      url: string;
      name: string;
      size: number;
      type: string;
    };
  };
  adminEmail?: string;
  status: string;
  applicationId: string;
  createdAt?: string;
  updatedAt?: string;
}

const insuranceCompanies = [
  { id: '1', name: 'ABC Insurance' },
  { id: '2', name: 'XYZ Insurance' },
  { id: '3', name: 'PQR Insurance' }
];

interface Claim {
  _id: string;
  claimId: string;
  userId: string;
  policyId: string;
  policyName: string;
  insuranceCompany: string;
  incidentDate: string;
  claimAmount: string;
  description: string;
  documents: Array<{
    url: string;
    name: string;
    size: number;
    type: string;
  }>;
  status: 'submitted' | 'in-review' | 'approved' | 'rejected' | 'paid';
  createdAt: string;
  updatedAt: string;
  reviewNotes?: string;
  reviewedAt?: string;
  adminEmail: string;
}

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter()
  const { adminEmail, isAuthenticated } = useAuth();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [policies, setPolicies] = useState<
    { _id: number; name: string; category: string; subcribers:number;revenue:number,}[]
  >([]);
  const [users, setUsers] = useState<
    { applicationId: string; userId: string; policyId: string; startDate: number; email: string ;status: string}[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const successMessage = searchParams ? searchParams.get("success") : null;
  
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loadingClaims, setLoadingClaims] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !adminEmail) {
      router.push('/admin-login');
    }
  }, [isAuthenticated, adminEmail, router]);

  const fetchClaims = async () => {
    try {
      setLoadingClaims(true);
      const response = await fetch(`/api/admin/claims?adminEmail=${adminEmail}`);
      if (response.ok) {
        const data = await response.json();
        setClaims(data.claims || []);
      } else {
        throw new Error('Failed to fetch claims');
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoadingClaims(false);
    }
  };

  // Calculate metrics for Overview section
  const totalUsers = users.length;
  const activePolicies = policies.reduce((sum, policy) => sum + (policy.subcribers || 0), 0);
  const monthlyRevenue = policies.reduce((sum, policy) => sum + (policy.revenue || 0), 0);
  
  // Calculate user growth (assuming we have creation dates)
  const newUsersThisMonth = users.filter(user => {
    // This is a simplified calculation - you'd need actual creation dates
    return true; // Placeholder - adjust based on your data
  }).length;
  const userGrowthPercentage = totalUsers > 0 ? 
    Math.round((newUsersThisMonth / totalUsers) * 100) : 0;

  // Calculate policy growth
  const newPoliciesThisMonth = policies.length; // Simplified
  const policyGrowthPercentage = activePolicies > 0 ? 
    Math.round((newPoliciesThisMonth / activePolicies) * 100) : 0;

  // Calculate revenue growth
  const revenueGrowthPercentage = monthlyRevenue > 0 
    ? Math.round((monthlyRevenue / (monthlyRevenue * 0.85)) * 100 - 100)
    : 0; // Simplified

  // Prepare policy statistics data
  const preparePolicyStatistics = () => {
    // Group by month - this is simplified, you'd need actual dates in your data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      newPolicies: Math.floor(Math.random() * 20) + 40, // Replace with actual data
      renewals: Math.floor(Math.random() * 15) + 30, // Replace with actual data
      cancellations: Math.floor(Math.random() * 5) + 5 // Replace with actual data
    }));
  };

  const policyStatisticsData = preparePolicyStatistics();

  // Prepare claims overview data
  const prepareClaimsOverview = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => {
      const submitted = claims.filter(claim => {
        // Simplified - you'd need to check actual dates
        return true;
      }).length;
      
      return {
        month,
        submitted,
        approved: Math.floor(submitted * 0.7), // Replace with actual approved count
        rejected: Math.floor(submitted * 0.3) // Replace with actual rejected count
      };
    });
  };

  const claimsOverviewData = prepareClaimsOverview();

  const handleApproveClaim = async (claimId: string) => {
    try {
      const response = await fetch('/api/admin/claims', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claimId,
          status: 'approved',
          reviewerId: adminEmail
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve claim');
      }

      setClaims(claims.map(claim => 
        claim.claimId === claimId 
          ? { ...claim, status: 'approved', reviewedAt: new Date().toISOString() } 
          : claim
      ));

      toast.success('Claim approved successfully!');
    } catch (error) {
      console.error('Error approving claim:', error);
      toast.error('Failed to approve claim');
    }
  };

  const handleRejectClaim = async (claimId: string) => {
    try {
      const response = await fetch('/api/admin/claims', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claimId,
          status: 'rejected',
          reviewNotes: rejectionReason,
          reviewerId: adminEmail
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject claim');
      }

      setClaims(claims.map(claim => 
        claim.claimId === claimId 
          ? { ...claim, status: 'rejected', reviewNotes: rejectionReason, reviewedAt: new Date().toISOString() } 
          : claim
      ));

      toast.success('Claim rejected successfully!');
      setRejectionReason("");
      setShowRejectDialog(false);
    } catch (error) {
      console.error('Error rejecting claim:', error);
      toast.error('Failed to reject claim');
    }
  };

  const handleViewClaim = (claim: Claim) => {
    setSelectedClaim(claim);
    setIsClaimDialogOpen(true);
  };

  const handleApprove = async (applicationId: string) => {
    try {
      const response = await fetch('/api/approve-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to approve application');
      }
  
      setUsers(users.map(user => 
        user.applicationId === applicationId 
          ? { ...user, status: 'approved' } 
          : user
      ));
  
      toast.success('Application approved successfully!');
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error('Failed to approve application');
    }
  };

  const handleReject = async (applicationId: string) => {
    setProcessingId(applicationId);
    try {
      const response = await fetch('/api/reject-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          applicationId,
          rejectionReason 
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to reject application');
      }
  
      setUsers(users.map(user => 
        user.applicationId === applicationId 
          ? { ...user, status: 'rejected' } 
          : user
      ));
  
      toast.success('Application rejected successfully!');
      setShowRejectDialog(false);
      setRejectionReason("");
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application');
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewClick = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/view-application-detail?applicationId=${applicationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch application details');
      }
      const { application } = await response.json();
      setSelectedApplication(application);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching application details:', error);
      toast.error('Failed to load application details');
    }
  };

  useEffect(() => {
    if (adminEmail) {
      fetchPolicies();
      fetchUsers();
      fetchClaims();
    }
  }, [adminEmail]);

  const fetchUsers = async () => {
    try{
      console.log(adminEmail);
      const response = await axios.get(`/api/display-application?email=${adminEmail}`);
      setUsers(response.data.application || []);
      console.log("Application:", response.data.application);
      setLoading(false);
    }catch (error) {
      console.error("Error fetching applications:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Application:", users);
  }, [users]);

  const fetchPolicies = async () => {
    try {
      console.log(adminEmail);
      const response = await axios.get(`/api/display-admin-policy?email=${adminEmail}`);
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
    <Suspense fallback={<div>Loading...</div>}>
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
                    <div className="text-4xl font-bold">{totalUsers}</div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {userGrowthPercentage > 0 ? (
                        <span className="text-green-500">↑ {userGrowthPercentage}%</span>
                      ) : (
                        <span className="text-red-500">↓ {Math.abs(userGrowthPercentage)}%</span>
                      )} from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Active Policies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{activePolicies}</div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {policyGrowthPercentage > 0 ? (
                        <span className="text-green-500">↑ {policyGrowthPercentage}%</span>
                      ) : (
                        <span className="text-red-500">↓ {Math.abs(policyGrowthPercentage)}%</span>
                      )} from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Monthly Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">₹{monthlyRevenue.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {revenueGrowthPercentage > 0 ? (
                        <span className="text-green-500">↑ {revenueGrowthPercentage}%</span>
                      ) : (
                        <span className="text-red-500">↓ {Math.abs(revenueGrowthPercentage)}%</span>
                      )} from last month
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
                    <BarChart data={policyStatisticsData}>
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
                    <LineChart data={claimsOverviewData}>
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
                        <Input 
                          type="search" 
                          placeholder="Search claims..." 
                          className="pl-8 w-full sm:w-[200px]" 
                          onChange={(e) => {
                            // Implement search functionality if needed
                          }}
                        />
                      </div>
                      <Button variant="outline" size="icon" onClick={fetchClaims}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingClaims ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : claims.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No claims found
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Claim ID</TableHead>
                          <TableHead>Policy</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Incident Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {claims.map((claim) => (
                          <TableRow key={claim._id}>
                            <TableCell>{claim.claimId}</TableCell>
                            <TableCell>{claim.policyName}</TableCell>
                            <TableCell>${claim.claimAmount}</TableCell>
                            <TableCell>{format(new Date(claim.incidentDate), 'MMM d, yyyy')}</TableCell>
                            <TableCell>
                              {claim.status === 'submitted' && (
                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Submitted</span>
                              )}
                              {claim.status === 'in-review' && (
                                <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">In Review</span>
                              )}
                              {claim.status === 'approved' && (
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Approved</span>
                              )}
                              {claim.status === 'rejected' && (
                                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Rejected</span>
                              )}
                              {claim.status === 'paid' && (
                                <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Paid</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewClaim(claim)}
                                >
                                  View
                                </Button>
                                {claim.status === 'submitted' || claim.status === 'in-review' ? (
                                  <>
                                    <Button 
                                      variant="default" 
                                      size="sm"
                                      onClick={() => handleApproveClaim(claim.claimId)}
                                    >
                                      Approve
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => {
                                        setSelectedClaim(claim);
                                        setShowRejectDialog(true);
                                      }}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                ) : null}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
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
                        <TableHead>Application ID</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Policy ID</TableHead>
                        <TableHead>Application Date</TableHead>
                        <TableHead>User Email</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.applicationId}>
                          <TableCell>{user.applicationId}</TableCell>
                          <TableCell>{user.userId}</TableCell>
                          <TableCell>{user.policyId}</TableCell>
                          <TableCell>{user.startDate}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewClick(user.applicationId)}
                              >
                                View
                              </Button>
                              <Button 
                                variant={user.status === 'approved' ? 'secondary' : 'default'}
                                size="sm"
                                onClick={() => handleApprove(user.applicationId)}
                                disabled={user.status === 'approved' || user.status === 'rejected'}
                              >
                                {user.status === 'approved' ? 'Approved' : 'Approve'}
                              </Button>
                              
                              <Button 
                                variant={user.status === 'rejected' ? 'destructive' : 'outline'}
                                size="sm"
                                onClick={() => {
                                  handleReject(user.applicationId);
                                  setShowRejectDialog(true);
                                }}
                                disabled={user.status === 'rejected' || user.status === 'approved'}
                              >
                                {user.status === 'rejected' ? 'Rejected' : 'Reject'}
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto text-gray-900 bg-white">
            <DialogHeader>
              <DialogTitle>
                <div className="flex justify-between items-center">
                  <span>Application Details</span>
                  <button 
                    onClick={() => setIsDialogOpen(false)}
                    className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </button>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            {selectedApplication && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Application ID:</span> {selectedApplication.applicationId}</p>
                    <p><span className="font-medium">Name:</span> {selectedApplication.firstName} {selectedApplication.lastName}</p>
                    <p><span className="font-medium">Email:</span> {selectedApplication.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedApplication.phone}</p>
                    <p><span className="font-medium">Date of Birth:</span> {selectedApplication.dateOfBirth}</p>
                    <p><span className="font-medium">Gender:</span> {selectedApplication.gender}</p>
                  </div>
                  
                  <h3 className="font-semibold mt-4 mb-2">Address</h3>
                  <div className="space-y-2">
                    <p>{selectedApplication.address}</p>
                    <p>{selectedApplication.city}, {selectedApplication.state} {selectedApplication.zipCode}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Employment Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Occupation:</span> {selectedApplication.occupation}</p>
                    <p><span className="font-medium">Employment Status:</span> {selectedApplication.employmentStatus}</p>
                    <p><span className="font-medium">Annual Income:</span> ${selectedApplication.annualIncome}</p>
                    <p><span className="font-medium">Employer:</span> {selectedApplication.employerName || 'N/A'}</p>
                    <p><span className="font-medium">Years Employed:</span> {selectedApplication.yearsEmployed || 'N/A'}</p>
                  </div>
                  
                  <h3 className="font-semibold mt-4 mb-2">Policy Details</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Policy ID:</span> {selectedApplication.policyId}</p>
                    <p><span className="font-medium">Coverage Amount:</span> ${selectedApplication.coverageAmount}</p>
                    <p><span className="font-medium">Start Date:</span> {selectedApplication.startDate}</p>
                    <p><span className="font-medium">Payment Frequency:</span> {selectedApplication.paymentFrequency}</p>
                  </div>
                </div>
                
                <div className="col-span-full">
                  <h3 className="font-semibold mb-2">Health Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Existing Conditions:</span> {selectedApplication.existingConditions}</p>
                    <p><span className="font-medium">Additional Notes:</span> {selectedApplication.additionalNotes}</p>
                  </div>
                </div>
                
                {selectedApplication.documents && (
                  <div className="col-span-full">
                    <h3 className="font-semibold mb-2">Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(selectedApplication.documents).map(([docType, doc]) => (
                        doc && doc.url && (
                          <div key={docType} className="border rounded p-3">
                            <h4 className="font-medium capitalize">{docType}</h4>
                            <p className="text-sm text-gray-600 truncate">{doc.name}</p>
                            <a 
                              href={doc.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              View Document
                            </a>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isClaimDialogOpen} onOpenChange={setIsClaimDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto text-gray-900 bg-white">
            <DialogHeader>
              <DialogTitle>
                <div className="flex justify-between items-center">
                  <span>Claim Details</span>
                  <button 
                    onClick={() => setIsClaimDialogOpen(false)}
                    className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </button>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            {selectedClaim && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Claim Information</h3>
                  <div className="space-y-3">
                    <p><span className="font-medium">Claim ID:</span> {selectedClaim.claimId}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className="ml-2 capitalize">{selectedClaim.status}</span>
                    </p>
                    <p><span className="font-medium">Policy:</span> {selectedClaim.policyName}</p>
                    <p><span className="font-medium">Insurance Company:</span> 
                      {insuranceCompanies.find(c => c.id === selectedClaim.insuranceCompany)?.name || selectedClaim.insuranceCompany}
                    </p>
                    <p><span className="font-medium">Claim Amount:</span> ${selectedClaim.claimAmount}</p>
                    <p><span className="font-medium">Incident Date:</span> 
                      {format(new Date(selectedClaim.incidentDate), 'MMM d, yyyy')}
                    </p>
                    <p><span className="font-medium">Submitted On:</span> 
                      {format(new Date(selectedClaim.createdAt), 'MMM d, yyyy')}
                    </p>
                    {selectedClaim.reviewedAt && (
                      <p><span className="font-medium">Reviewed On:</span> 
                        {format(new Date(selectedClaim.reviewedAt), 'MMM d, yyyy')}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Claim Description</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p>{selectedClaim.description}</p>
                  </div>
                  
                  {selectedClaim.reviewNotes && (
                    <>
                      <h3 className="font-semibold mt-6 mb-4">Review Notes</h3>
                      <div className="bg-gray-50 p-4 rounded">
                        <p>{selectedClaim.reviewNotes}</p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="col-span-full">
                  <h3 className="font-semibold mb-4">Supporting Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedClaim.documents.map((doc, index) => (
                      <div key={index} className="border rounded p-3">
                        <h4 className="font-medium capitalize">Document {index + 1}</h4>
                        <p className="text-sm text-gray-600 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500">{(doc.size / 1024).toFixed(2)} KB</p>
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                        >
                          View Document
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Claim</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this claim.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[120px]"
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowRejectDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    if (selectedClaim) {
                      handleRejectClaim(selectedClaim.claimId);                      }
                  }}
                  disabled={!rejectionReason.trim()}
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Suspense>
  );
}                                                                                                           