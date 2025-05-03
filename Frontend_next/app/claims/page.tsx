"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUploader } from "@/components/FileUploader"
import { CheckCircle, Clock, AlertCircle, FileText } from "lucide-react"
import useAuth from "@/context/store"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
interface Policy {
  _id: string;
  policyId: string;
  name: string;
  type: string;
  status: string;
  coverageAmount: string;
  startDate: string;
  renewalDate: string;
}

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
}

const insuranceCompanies = [
  { id: "acme-ins", name: "Acme Insurance" },
  { id: "global-cover", name: "Global Coverage" },
  { id: "secure-life", name: "SecureLife" },
  { id: "trust-shield", name: "TrustShield Insurance" },
]

export default function ClaimsPage() {
  const [activeTab, setActiveTab] = useState("new")
  const [selectedPolicy, setSelectedPolicy] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [incidentDate, setIncidentDate] = useState("")
  const [claimAmount, setClaimAmount] = useState("")
  const [claimDescription, setClaimDescription] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "submitting" | "success">("idle")
  const [userPolicies, setUserPolicies] = useState<Policy[]>([])
  const [loadingPolicies, setLoadingPolicies] = useState(true)
  const [userClaims, setUserClaims] = useState<Claim[]>([])
  const [loadingClaims, setLoadingClaims] = useState(false)
  const { user } = useAuth() as { user: { id: string, username: string } | null } || { user: null }
  const router = useRouter()
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);
  useEffect(() => {
    if (user?.id) {
      fetchUserPolicies()
      fetchUserClaims()
    }
  }, [user?.id])

  const fetchUserPolicies = async () => {
    try {
      setLoadingPolicies(true)
      const response = await fetch(`/api/user-policies?userId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setUserPolicies(data.policies || [])
      } else {
        console.error("Failed to fetch user policies")
      }
    } catch (error) {
      console.error("Error fetching user policies:", error)
    } finally {
      setLoadingPolicies(false)
    }
  }

  const fetchUserClaims = async () => {
    try {
      setLoadingClaims(true)
      const response = await fetch(`/api/user-claims?userId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setUserClaims(data.claims || [])
      } else {
        console.error("Failed to fetch user claims")
      }
    } catch (error) {
      console.error("Error fetching user claims:", error)
    } finally {
      setLoadingClaims(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmissionStatus("submitting")

    try {
      // Upload files first (you'll need to implement this)
      const uploadedFiles = await uploadFiles(files)
      
      const selectedPolicyData = userPolicies.find(p => p.policyId === selectedPolicy)
      
      const claimData = {
        userId: user?.id,
        policyId: selectedPolicy,
        policyName: selectedPolicyData?.name || '',
        insuranceCompany: selectedCompany,
        incidentDate,
        claimAmount,
        description: claimDescription,
        documents: uploadedFiles
      }

      const response = await fetch('/api/submit-claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claimData),
      })

      if (response.ok) {
        setSubmissionStatus("success")
        fetchUserClaims() // Refresh claims list
      } else {
        throw new Error('Failed to submit claim')
      }
    } catch (error) {
      console.error('Claim submission error:', error)
      setSubmissionStatus("idle")
      // Show error to user
    }
  }

  const uploadFiles = async (files: File[]): Promise<any[]> => {
    // Implement your file upload logic here
    // This should return an array of file metadata with URLs
    return files.map(file => ({
      url: URL.createObjectURL(file), // Replace with actual uploaded URL
      name: file.name,
      size: file.size,
      type: file.type
    }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Submitted</span>
      case 'in-review':
        return <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">In Review</span>
      case 'approved':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Approved</span>
      case 'rejected':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Rejected</span>
      case 'paid':
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Paid</span>
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unknown</span>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'in-review':
        return <Clock className="h-5 w-5 text-amber-500" />
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-purple-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  useEffect(() => {
    if (!user) {
      router.push("/user-login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const activeClaims = userClaims.filter(claim => ['submitted', 'in-review'].includes(claim.status))
  const claimHistory = userClaims.filter(claim => ['approved', 'rejected', 'paid'].includes(claim.status))

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-8 text-primary">Claims Management</h1>

        <Tabs defaultValue="new" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="new">New Claim</TabsTrigger>
            <TabsTrigger value="active">Active Claims ({activeClaims.length})</TabsTrigger>
            <TabsTrigger value="history">Claim History ({claimHistory.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle>File a New Claim</CardTitle>
                <CardDescription>Submit a new insurance claim by filling out the form below</CardDescription>
              </CardHeader>
              <CardContent>
                {submissionStatus === "success" ? (
                  <motion.div
                    className="flex flex-col items-center justify-center py-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="rounded-full bg-green-100 p-3 mb-4">
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Claim Submitted Successfully!</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-6">
                      Your claim has been submitted and is now under review. You will receive updates via email and in
                      your dashboard.
                    </p>
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSubmissionStatus("idle")
                          setSelectedPolicy("")
                          setSelectedCompany("")
                          setIncidentDate("")
                          setClaimAmount("")
                          setClaimDescription("")
                          setFiles([])
                        }}
                      >
                        Submit Another Claim
                      </Button>
                      <Button onClick={() => setActiveTab("active")}>View Active Claims</Button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="policy">Select Policy</Label>
                        <Select 
                          value={selectedPolicy} 
                          onValueChange={setSelectedPolicy} 
                          required
                        >
                          <SelectTrigger id="policy">
                            <SelectValue placeholder={loadingPolicies ? "Loading policies..." : "Select a policy"} />
                          </SelectTrigger>
                          <SelectContent>
                            {loadingPolicies ? (
                              <SelectItem value="loading" disabled>
                                Loading policies...
                              </SelectItem>
                            ) : userPolicies.length > 0 ? (
                              userPolicies.map((policy) => (
                                <SelectItem 
                                  key={policy._id} 
                                  value={policy.policyId}
                                >
                                  <div className="flex flex-col">
                                    <span>{policy.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {policy.type} • Coverage: {policy.coverageAmount}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-policies" disabled>
                                No policies found
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Insurance Company</Label>
                        <Select value={selectedCompany} onValueChange={setSelectedCompany} required>
                          <SelectTrigger id="company">
                            <SelectValue placeholder="Select insurance company" />
                          </SelectTrigger>
                          <SelectContent>
                            {insuranceCompanies.map((company) => (
                              <SelectItem key={company.id} value={company.id}>
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="incident-date">Incident Date</Label>
                        <Input 
                          id="incident-date" 
                          type="date" 
                          required 
                          value={incidentDate}
                          onChange={(e) => setIncidentDate(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="claim-amount">Claim Amount</Label>
                        <Input
                          id="claim-amount"
                          type="text"
                          placeholder="$0.00"
                          value={claimAmount}
                          onChange={(e) => setClaimAmount(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Claim Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Please provide details about your claim..."
                        className="min-h-[120px]"
                        value={claimDescription}
                        onChange={(e) => setClaimDescription(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Upload Documents</Label>
                      <FileUploader
                        onFilesSelected={(newFiles) => setFiles([...files, ...newFiles])}
                        maxFiles={5}
                        acceptedFileTypes={[".pdf", ".jpg", ".jpeg", ".png"]}
                        maxFileSizeMB={10}
                      />

                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <Label>Uploaded Files</Label>
                          <div className="space-y-2">
                            {files.map((file, index) => (
                              <div key={index} className="flex items-center p-2 rounded bg-muted/30">
                                <FileText className="h-4 w-4 mr-2" />
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-auto"
                                  onClick={() => {
                                    const newFiles = [...files]
                                    newFiles.splice(index, 1)
                                    setFiles(newFiles)
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4">
                      <Button type="submit" className="w-full md:w-auto" disabled={submissionStatus === "submitting"}>
                        {submissionStatus === "submitting" ? "Submitting..." : "Submit Claim"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Claims</CardTitle>
                <CardDescription>Track the status of your ongoing insurance claims</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingClaims ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : activeClaims.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    You don't have any active claims
                  </div>
                ) : (
                  <div className="space-y-6">
                    {activeClaims.map((claim) => (
                      <div key={claim._id} className="rounded-lg border p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(claim.status)}
                              <h3 className="font-semibold">{claim.claimId}</h3>
                              {getStatusBadge(claim.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {claim.policyName} - {insuranceCompanies.find(c => c.id === claim.insuranceCompany)?.name || claim.insuranceCompany}
                            </p>
                            <p className="text-sm">
                              Submitted on: {format(new Date(claim.createdAt), 'MMM d, yyyy')}
                            </p>
                            {claim.status === 'rejected' && claim.reviewNotes && (
                              <p className="text-sm text-red-600 mt-2">
                                <strong>Reason:</strong> {claim.reviewNotes}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-start md:items-end">
                            <p className="font-semibold">${claim.claimAmount}</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => {
                                setSelectedClaim(claim);
                                setIsClaimDialogOpen(true);
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Claim History</CardTitle>
                <CardDescription>View your past insurance claims and their outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingClaims ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : claimHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    You don't have any claim history
                  </div>
                ) : (
                  <div className="space-y-6">
                    {claimHistory.map((claim) => (
                      <div key={claim._id} className="rounded-lg border p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(claim.status)}
                              <h3 className="font-semibold">{claim.claimId}</h3>
                              {getStatusBadge(claim.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {claim.policyName} - {insuranceCompanies.find(c => c.id === claim.insuranceCompany)?.name || claim.insuranceCompany}
                            </p>
                            <p className="text-sm">
                              {claim.status === 'approved' || claim.status === 'paid' 
                                ? `Approved on: ${format(new Date(claim.reviewedAt || claim.updatedAt), 'MMM d, yyyy')}`
                                : `Rejected on: ${format(new Date(claim.reviewedAt || claim.updatedAt), 'MMM d, yyyy')}`}
                            </p>
                            {claim.status === 'rejected' && claim.reviewNotes && (
                              <p className="text-sm text-red-600 mt-2">
                                <strong>Reason:</strong> {claim.reviewNotes}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-start md:items-end">
                            <p className="font-semibold">${claim.claimAmount}</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
      <Dialog open={isClaimDialogOpen} onOpenChange={setIsClaimDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Claim Details</DialogTitle>
        </DialogHeader>
        {selectedClaim && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Claim ID</p>
                <p>{selectedClaim.claimId}</p>
              </div>
              <div>
                <p className="font-medium">Status</p>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedClaim.status)}
                  <span className="capitalize">{selectedClaim.status}</span>
                </div>
              </div>
              <div>
                <p className="font-medium">Policy</p>
                <p>{selectedClaim.policyName}</p>
              </div>
              <div>
                <p className="font-medium">Claim Amount</p>
                <p>${selectedClaim.claimAmount}</p>
              </div>
            </div>
            
            <div>
              <p className="font-medium">Description</p>
              <p className="bg-gray-50 p-3 rounded">{selectedClaim.description}</p>
            </div>
            
            <div>
              <p className="font-medium">Documents</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {selectedClaim.documents.map((doc, index) => (
                  <a 
                    key={index} 
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="truncate">Document {index + 1}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </div>
  )
}