"use client"

import { useState, useEffect, Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { FileUploader } from "@/components/FileUploader"
import { CheckCircle, ChevronLeft, ChevronRight, FileText, Info } from "lucide-react"
import { ApplicationData } from "@/types/application"
import { toast } from "react-toastify"

import useAuth from "@/context/store";

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function ApplyPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth() as { user: { id: string } | null } || { user: null };
  const policyId = searchParams ? searchParams.get("policy") : null

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<ApplicationData>>({
    // Personal Information
    userId: user?.id || undefined,
    policyId: policyId || undefined,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",

    // Professional Information
    occupation: "",
    employmentStatus: "",
    annualIncome: "",
    employerName: "",
    yearsEmployed: "",

    // Insurance Details
    coverageAmount: "",
    startDate: "",
    paymentFrequency: "monthly",
    existingConditions: "",
    additionalNotes: "",

    // Terms
    agreeToTerms: false,
    allowCommunication: false,
    
    // Link to the policy ID if provided in URL
    
  })

  // Store file objects separately because they need special handling
  const [files, setFiles] = useState<File[]>([])
  const [idDocument, setIdDocument] = useState<File | null>(null)
  const [incomeDocument, setIncomeDocument] = useState<File | null>(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionData, setSubmissionData] = useState<{
    applicationId: string;
    submittedOn: string;
  } | null>(null)

  const handleInputChange = (field: string, value: string | boolean | File | null | File[]) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleFileUpload = (newFiles: File[]) => {
    setFiles([...files, ...newFiles])
  }

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1)
    window.scrollTo(0, 0)
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }

  // Define maximum file size (e.g., 5MB)
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  
  // Helper function to upload a file

  
  
  interface UploadResponse {
    url?: string;
    error?: string;
    message?: string;
  }
  
  interface ApplicationResponse {
    success: boolean;
    applicationId?: string;
    submittedOn?: string;
    message?: string;
  }
  
  interface UploadResult {
    success: boolean;
    url?: string;
    originalName?: string;
    size?: number;
    type?: string;
    message?: string;
  }
  
  const uploadFile = async (file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('/api/file-upload', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Upload failed');
      }
  
      return data;
  
    } catch (error) {
      console.error('Upload error:', error);
      const message = error instanceof Error ? error.message : 'File upload failed';
      toast.error(message);
      return { success: false, message };
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      // Validate required files exist
      if (!idDocument || !incomeDocument) {
        throw new Error('Please upload all required documents');
      }
  
      // Upload files in parallel
      const [idResult, incomeResult, ...additionalResults] = await Promise.all([
        uploadFile(idDocument),
        uploadFile(incomeDocument),
        ...files.map(file => uploadFile(file))
      ]);
  
      // Verify required uploads succeeded
      if (!idResult.success || !incomeResult.success) {
        throw new Error(
          [idResult.message, incomeResult.message]
            .filter(Boolean)
            .join(' ') || 'Document upload failed'
        );
      }
  
      // Prepare submission data with proper typing
      const submission = {
        ...formData,  // Your other form fields
        documents: {
          identification: {
            url: idResult.url!,
            name: idResult.originalName!,
            size: idResult.size!,
            type: idResult.type!
          },
          incomeProof: {
            url: incomeResult.url!,
            name: incomeResult.originalName!,
            size: incomeResult.size!,
            type: incomeResult.type!
          },
          ...(additionalResults.some(r => r.success) && {
            additional: additionalResults
              .filter(res => res.success)
              .map(res => ({
                url: res.url!,
                name: res.originalName!,
                size: res.size!,
                type: res.type!
              }))
          })
        }
      };
  
      // Submit application
      const response = await fetch('/api/applications/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
  
      const result = await response.json();
  
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Application submission failed');
      }
  
      // Handle success
      setSubmissionData({
        applicationId: result.applicationId,
        submittedOn: new Date().toLocaleDateString()
      });
      setIsSubmitted(true);
      
      storeApplicationId(result.applicationId);

    // Redirect to confirmation
      redirectToConfirmation(result.applicationId);

      toast.success('Application submitted successfully!');

    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error instanceof Error ? 
        error.message : 
        'Please try again');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const storeApplicationId = (id: string) => {
    if (typeof window === 'undefined') return;
    
    try {
      // Store in sessionStorage (cleared when tab closes)
      window.sessionStorage.setItem('lastApplicationId', id);
      // Store in localStorage (persists between sessions)
      window.localStorage.setItem('lastApplicationId', id);
    } catch (error) {
      console.error('Failed to store application ID:', error);
      // Continue even if storage fails - we still have the ID in the URL
    }
  };
  
  // Separate redirection function
  const redirectToConfirmation = (id: string) => {
    // Using Next.js router for client-side navigation
    router.push(`/policy/confirmation?id=${id}`);
    
    // Alternative if you need to force a full page load:
    // window.location.href = `/policy/confirmation?id=${id}`;
  };

  const handleGoToConfirmation = () => {
    if (!submissionData?.applicationId) {
      toast.error("No application ID found");
      return;
    }
    
    router.push(`/policy/confirmation?applicationId=${submissionData.applicationId}`);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto py-12 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {isSubmitted ? (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Application Submitted Successfully!</h2>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Your insurance application has been submitted. We'll review your information and get back to you
                    shortly.
                  </p>
                  <div className="bg-muted/30 p-4 rounded-lg mb-6 w-full max-w-md">
                    <h3 className="font-medium mb-2">Application Details</h3>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Application ID:</span>
                      <span className="text-sm font-medium">{submissionData?.applicationId}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Submitted On:</span>
                      <span className="text-sm font-medium">{submissionData?.submittedOn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span className="text-sm font-medium text-amber-600">Under Review</span>
                    </div>
                  </div>
                  <Button onClick={handleGoToConfirmation}>View Confirmation</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="max-w-2xl mx-auto mb-8">
                <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                <h1 className="text-3xl font-bold mb-2">Apply for Insurance</h1>
                <p className="text-muted-foreground mb-6">
                  Complete the application form below to apply for your selected insurance policy.
                </p>

                <div className="flex justify-between mb-8">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`flex flex-col items-center ${currentStep >= step ? "text-primary" : "text-muted-foreground"}`}
                    >
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                          currentStep > step
                            ? "bg-primary text-primary-foreground"
                            : currentStep === step
                              ? "border-2 border-primary"
                              : "border-2 border-muted"
                        }`}
                      >
                        {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                      </div>
                      <span className="text-sm">
                        {step === 1
                          ? "Personal"
                          : step === 2
                            ? "Professional"
                            : step === 3
                              ? "Policy Details"
                              : "Documents"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>
                    {currentStep === 1
                      ? "Personal Information"
                      : currentStep === 2
                        ? "Professional Information"
                        : currentStep === 3
                          ? "Insurance Details"
                          : "Required Documents"}
                  </CardTitle>
                  <CardDescription>
                    {currentStep === 1
                      ? "Provide your personal details"
                      : currentStep === 2
                        ? "Tell us about your occupation and income"
                        : currentStep === 3
                          ? "Customize your insurance policy"
                          : "Upload the necessary documents"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange("lastName", e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              value={formData.dateOfBirth}
                              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                              value={formData.gender}
                              onValueChange={(value) => handleInputChange("gender", value)}
                              required
                            >
                              <SelectTrigger id="gender">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={formData.city}
                              onChange={(e) => handleInputChange("city", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              value={formData.state}
                              onChange={(e) => handleInputChange("state", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="zipCode">Zip Code</Label>
                            <Input
                              id="zipCode"
                              value={formData.zipCode}
                              onChange={(e) => handleInputChange("zipCode", e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="occupation">Occupation</Label>
                          <Input
                            id="occupation"
                            value={formData.occupation}
                            onChange={(e) => handleInputChange("occupation", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="employmentStatus">Employment Status</Label>
                          <Select
                            value={formData.employmentStatus}
                            onValueChange={(value) => handleInputChange("employmentStatus", value)}
                            required
                          >
                            <SelectTrigger id="employmentStatus">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full-time">Full-time</SelectItem>
                              <SelectItem value="part-time">Part-time</SelectItem>
                              <SelectItem value="self-employed">Self-employed</SelectItem>
                              <SelectItem value="unemployed">Unemployed</SelectItem>
                              <SelectItem value="retired">Retired</SelectItem>
                              <SelectItem value="student">Student</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="annualIncome">Annual Income</Label>
                          <Input
                            id="annualIncome"
                            type="number"
                            placeholder="$"
                            value={formData.annualIncome}
                            onChange={(e) => handleInputChange("annualIncome", e.target.value)}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="employerName">Employer Name</Label>
                            <Input
                              id="employerName"
                              value={formData.employerName}
                              onChange={(e) => handleInputChange("employerName", e.target.value)}
                              required={
                                formData.employmentStatus === "full-time" || formData.employmentStatus === "part-time"
                              }
                              disabled={
                                formData.employmentStatus !== "full-time" && formData.employmentStatus !== "part-time"
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="yearsEmployed">Years Employed</Label>
                            <Input
                              id="yearsEmployed"
                              type="number"
                              value={formData.yearsEmployed}
                              onChange={(e) => handleInputChange("yearsEmployed", e.target.value)}
                              required={
                                formData.employmentStatus === "full-time" || formData.employmentStatus === "part-time"
                              }
                              disabled={
                                formData.employmentStatus !== "full-time" && formData.employmentStatus !== "part-time"
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="coverageAmount">Coverage Amount</Label>
                          <Select
                            value={formData.coverageAmount}
                            onValueChange={(value) => handleInputChange("coverageAmount", value)}
                            required
                          >
                            <SelectTrigger id="coverageAmount">
                              <SelectValue placeholder="Select coverage amount" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="500000">$500,000</SelectItem>
                              <SelectItem value="750000">$750,000</SelectItem>
                              <SelectItem value="1000000">$1,000,000</SelectItem>
                              <SelectItem value="1500000">$1,500,000</SelectItem>
                              <SelectItem value="2000000">$2,000,000</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="startDate">Coverage Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => handleInputChange("startDate", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Payment Frequency</Label>
                          <RadioGroup
                            value={formData.paymentFrequency}
                            onValueChange={(value) => handleInputChange("paymentFrequency", value)}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="monthly" id="monthly" />
                              <Label htmlFor="monthly">Monthly</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="quarterly" id="quarterly" />
                              <Label htmlFor="quarterly">Quarterly</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="annually" id="annually" />
                              <Label htmlFor="annually">Annually</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="existingConditions">Existing Conditions (if applicable)</Label>
                          <Textarea
                            id="existingConditions"
                            placeholder="Please list any existing conditions or health issues"
                            value={formData.existingConditions}
                            onChange={(e) => handleInputChange("existingConditions", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="additionalNotes">Additional Notes</Label>
                          <Textarea
                            id="additionalNotes"
                            placeholder="Any additional information you'd like to provide"
                            value={formData.additionalNotes}
                            onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label>Identification Document</Label>
                          <div className="bg-muted/30 p-4 rounded-lg">
                            <div className="flex items-start gap-2 mb-2">
                              <Info className="h-4 w-4 text-muted-foreground mt-1" />
                              <p className="text-sm text-muted-foreground">
                                Please upload a government-issued ID (passport, driver's license, etc.)
                              </p>
                            </div>
                            <FileUploader
                              onFilesSelected={(files) => setIdDocument(files[0])}
                              maxFiles={1}
                              acceptedFileTypes={[".pdf", ".jpg", ".jpeg", ".png"]}
                              maxFileSizeMB={5}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Proof of Income</Label>
                          <div className="bg-muted/30 p-4 rounded-lg">
                            <div className="flex items-start gap-2 mb-2">
                              <Info className="h-4 w-4 text-muted-foreground mt-1" />
                              <p className="text-sm text-muted-foreground">
                                Please upload a recent pay stub, tax return, or other proof of income
                              </p>
                            </div>
                            <FileUploader
                              onFilesSelected={(files) => setIncomeDocument(files[0])}
                              maxFiles={1}
                              acceptedFileTypes={[".pdf", ".jpg", ".jpeg", ".png"]}
                              maxFileSizeMB={5}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Additional Documents (Optional)</Label>
                          <div className="bg-muted/30 p-4 rounded-lg">
                            <div className="flex items-start gap-2 mb-2">
                              <Info className="h-4 w-4 text-muted-foreground mt-1" />
                              <p className="text-sm text-muted-foreground">
                                Upload any additional documents that may support your application
                              </p>
                            </div>
                            <FileUploader
                              onFilesSelected={handleFileUpload}
                              maxFiles={3}
                              acceptedFileTypes={[".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"]}
                              maxFileSizeMB={10}
                            />
                          </div>
                        </div>

                        {files.length > 0 && (
                          <div className="space-y-2">
                            <Label>Uploaded Files</Label>
                            <div className="space-y-2">
                              {files.map((file, index) => (
                                <div key={index} className="flex items-center p-2 rounded bg-muted/30">
                                  <FileText className="h-4 w-4 mr-2" />
                                  <span className="text-sm">{file.name}</span>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                  </span>
                                  <button
                                    type="button"
                                    className="ml-auto text-red-500 hover:text-red-700"
                                    onClick={() => {
                                      const newFiles = [...files];
                                      newFiles.splice(index, 1);
                                      setFiles(newFiles);
                                    }}
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-4 pt-4">
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id="agreeToTerms"
                              checked={formData.agreeToTerms as boolean}
                              onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked === true)}
                              required
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label
                                htmlFor="agreeToTerms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                I agree to the terms and conditions
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                By checking this box, you agree to our{" "}
                                <a href="#" className="text-primary hover:underline">
                                  Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-primary hover:underline">
                                  Privacy Policy
                                </a>
                                .
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id="allowCommunication"
                              checked={formData.allowCommunication as boolean}
                              onCheckedChange={(checked) => handleInputChange("allowCommunication", checked === true)}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label
                                htmlFor="allowCommunication"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                I agree to receive communications
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                We'll send you updates about your policy and other relevant information.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {currentStep > 1 ? (
                    <Button variant="outline" onClick={handlePrevStep}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {currentStep < 4 ? (
                    <Button onClick={handleNextStep}>
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={isSubmitting || !formData.agreeToTerms}>
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </>
          )}
        </motion.div>
      </div>
    </Suspense>
  )
}