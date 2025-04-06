"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Home, Mail, Phone } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

interface ApplicationData {
  id: string
  date: string
  status: string
  estimatedResponse: string
  policyType: string
  company: string
  plan: string
  coverage: string
  premium: string
  startDate: string
  applicant: {
    name: string
    email: string
    phone: string
  }
}

export default function ConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applicationId, setApplicationId] = useState<string | null>(null)

  //multiple tab
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lastApplicationId') {
        // Update state if the ID changes in another tab
        setApplicationId(e.newValue);
      }
    };
  
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Get application ID safely
  useEffect(() => {
    // 1. First try URL parameter
    const urlId = searchParams?.get('id') || null
    if (urlId) {
      setApplicationId(urlId)
      return
    }

    // 2. Check storage only on client side
    if (typeof window !== 'undefined') {
      // Check session storage (if coming from form submission)
      const sessionId = window.sessionStorage.getItem('lastApplicationId')
      if (sessionId) {
        setApplicationId(sessionId)
        return
      }

      // 3. Check local storage as fallback
      const localId = window.localStorage.getItem('lastApplicationId')
      if (localId) {
        setApplicationId(localId)
        return
      }
    }

    setError('No application ID found. Please return to the application form.')
    setLoading(false)
  }, [searchParams])

  // Fetch application data
  useEffect(() => {
    if (!applicationId) return;
  
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/applications/${applicationId}`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        console.log('Received data:', data); // Debug log
  
        setApplicationData({
          id: data.applicationId,
          date: new Date(data.createdAt).toLocaleDateString(),
          status: data.status || "in process", // "submitted" -> "Submitted"
          estimatedResponse: "3-5 business days", // This could come from your API if available
          policyType: getPolicyType(data.policyId), // Map policyId to human-readable name
          company: getInsuranceCompany(data.policyId), // Map policyId to company
          plan: getPlanName(data.policyId), // Map policyId to plan name
          coverage: data.coverageAmount ? `$${parseInt(data.coverageAmount).toLocaleString()}` : "Not specified",
          premium: calculatePremium(data), // Custom function based on your business logic
          startDate: data.startDate ? new Date(data.startDate).toLocaleDateString() : "Not specified",
          applicant: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            phone: data.phone || "Not provided"
          }
        });
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to load application details');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [applicationId]);

  // Add these utility functions to your component file
const getPolicyType = (policyId: string) => {
  const policyMap: Record<string, string> = {
    'standard-policy': 'Standard Health Insurance',
    'premium-policy': 'Premium Health Coverage',
    // Add other policy IDs as needed
  };
  return policyMap[policyId] || "Health Insurance";
};

const getInsuranceCompany = (policyId: string) => {
  const companyMap: Record<string, string> = {
    'standard-policy': 'Acme Health Insurance',
    'premium-policy': 'Gold Star Insurance',
    // Add other policy IDs as needed
  };
  return companyMap[policyId] || "Insurance Provider";
};

const getPlanName = (policyId: string) => {
  const planMap: Record<string, string> = {
    'standard-policy': 'Basic Health Plan',
    'premium-policy': 'Premium Care Plan',
    // Add other policy IDs as needed
  };
  return planMap[policyId] || "Health Plan";
};

const calculatePremium = (data: any) => {
  // Add your actual premium calculation logic here
  // For now, we'll just return a placeholder
  if (data.paymentFrequency === 'monthly') {
    return "$120/month";
  } else if (data.paymentFrequency === 'annual') {
    return "$1,200/year";
  }
  return "Contact for pricing";
};


  const handleDownloadConfirmation = () => {
    if (!applicationData) return
    alert(`Downloading confirmation for application ${applicationData.id}...`)
    // Actual implementation would generate a PDF
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p>Loading your application details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
            <CheckCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Application Not Found</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex flex-col space-y-3">
            <Button asChild>
              <Link href="/apply">Return to Application Form</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go to Homepage</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!applicationData) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">No Application Data</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find your application details. Please contact support if you believe this is an error.
          </p>
          <div className="flex flex-col space-y-3">
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go to Homepage</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // When retrieving the ID in your confirmation page:
const getStoredApplicationId = () => {
  if (typeof window === 'undefined') return null;
  
  // Clean up old entries (optional)
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const storedDate = localStorage.getItem('lastApplicationDate');
  
  if (storedDate && parseInt(storedDate) < oneWeekAgo) {
    localStorage.removeItem('lastApplicationId');
    localStorage.removeItem('lastApplicationDate');
    return null;
  }
  
  return localStorage.getItem('lastApplicationId');
};

  const handleReturnHome = () => {
    router.push('/')  
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Application Confirmed</h1>
          <p className="text-muted-foreground max-w-md">
            Your insurance application has been received and is currently under review.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Application Summary</CardTitle>
            <CardDescription>Details of your insurance application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Application ID</h3>
                  <p className="font-medium">{applicationData.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Submission Date</h3>
                  <p className="font-medium">{applicationData.date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 mr-2">
                      {applicationData.status}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Estimated Response</h3>
                  <p className="font-medium">{applicationData.estimatedResponse}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-3">Policy Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Insurance Type</h4>
                    <p className="font-medium">{applicationData.policyType}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Insurance Provider</h4>
                    <p className="font-medium">{applicationData.company}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Selected Plan</h4>
                    <p className="font-medium">{applicationData.plan}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Coverage Amount</h4>
                    <p className="font-medium">{applicationData.coverage}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Premium</h4>
                    <p className="font-medium">{applicationData.premium}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Start Date (Tentative)</h4>
                    <p className="font-medium">{applicationData.startDate}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-3">Applicant Information</h3>
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Name</h4>
                    <p className="font-medium">{applicationData.applicant.name}</p>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                    <p className="font-medium">{applicationData.applicant.email}</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                    <p className="font-medium">{applicationData.applicant.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              <li className="flex items-start">
                <div className="flex h-6 w-6 rounded-full bg-primary text-primary-foreground items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Application Review</h4>
                  <p className="text-sm text-muted-foreground">
                    Our underwriting team will review your application and submitted documents.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex h-6 w-6 rounded-full bg-primary text-primary-foreground items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Verification</h4>
                  <p className="text-sm text-muted-foreground">
                    We may contact you for additional information or clarification if needed.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex h-6 w-6 rounded-full bg-primary text-primary-foreground items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Decision</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll receive an email notification once a decision has been made on your application.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex h-6 w-6 rounded-full bg-primary text-primary-foreground items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="font-medium">Policy Issuance</h4>
                  <p className="text-sm text-muted-foreground">
                    If approved, your policy documents will be sent to you and coverage will begin on the start date.
                  </p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={handleDownloadConfirmation} className="gap-2">
            <Download className="h-4 w-4" /> Download Confirmation
          </Button>
          <Button onClick={handleReturnHome} className="gap-2">
            <Home className="h-4 w-4" /> Return to Home
          </Button>
        </div>
      </motion.div>
    </div>
  )
}