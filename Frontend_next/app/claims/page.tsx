"use client"

import type React from "react"

import { useState } from "react"
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

const policies = [
  { id: "health-gold", name: "Health Gold Plan" },
  { id: "vehicle-comp", name: "Vehicle Comprehensive" },
  { id: "life-term", name: "Term Life Insurance" },
  { id: "home-plus", name: "Home Insurance Plus" },
]

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
  const [claimAmount, setClaimAmount] = useState("")
  const [claimDescription, setClaimDescription] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "submitting" | "success">("idle")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmissionStatus("submitting")

    // Simulate API call
    setTimeout(() => {
      setSubmissionStatus("success")
    }, 2000)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-8 text-primary">Claims Management</h1>

        <Tabs defaultValue="new" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="new">New Claim</TabsTrigger>
            <TabsTrigger value="active">Active Claims</TabsTrigger>
            <TabsTrigger value="history">Claim History</TabsTrigger>
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
                        <Select value={selectedPolicy} onValueChange={setSelectedPolicy} required>
                          <SelectTrigger id="policy">
                            <SelectValue placeholder="Select a policy" />
                          </SelectTrigger>
                          <SelectContent>
                            {policies.map((policy) => (
                              <SelectItem key={policy.id} value={policy.id}>
                                {policy.name}
                              </SelectItem>
                            ))}
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
                        <Input id="incident-date" type="date" required />
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
                <div className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-5 w-5 text-amber-500" />
                          <h3 className="font-semibold">Claim #CL-1001</h3>
                          <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">In Review</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Health Gold Plan - Acme Insurance</p>
                        <p className="text-sm">Submitted on: May 15, 2023</p>
                      </div>
                      <div className="flex flex-col items-start md:items-end">
                        <p className="font-semibold">$1,200.00</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                          <h3 className="font-semibold">Claim #CL-1002</h3>
                          <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                            Additional Info Needed
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Vehicle Comprehensive - Global Coverage</p>
                        <p className="text-sm">Submitted on: June 2, 2023</p>
                      </div>
                      <div className="flex flex-col items-start md:items-end">
                        <p className="font-semibold">$3,500.00</p>
                        <Button variant="default" size="sm" className="mt-2">
                          Provide Information
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
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
                <div className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <h3 className="font-semibold">Claim #CL-0987</h3>
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Approved</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Health Gold Plan - Acme Insurance</p>
                        <p className="text-sm">Completed on: March 10, 2023</p>
                      </div>
                      <div className="flex flex-col items-start md:items-end">
                        <p className="font-semibold">$850.00</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                          <h3 className="font-semibold">Claim #CL-0965</h3>
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Rejected</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Home Insurance Plus - TrustShield Insurance
                        </p>
                        <p className="text-sm">Completed on: February 5, 2023</p>
                      </div>
                      <div className="flex flex-col items-start md:items-end">
                        <p className="font-semibold">$2,300.00</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <h3 className="font-semibold">Claim #CL-0943</h3>
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Approved</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Vehicle Comprehensive - Global Coverage</p>
                        <p className="text-sm">Completed on: January 18, 2023</p>
                      </div>
                      <div className="flex flex-col items-start md:items-end">
                        <p className="font-semibold">$1,750.00</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

