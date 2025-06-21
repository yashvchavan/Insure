"use client";
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

export default function ConfirmationClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applicationId, setApplicationId] = useState<string | null>(null)

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lastApplicationId') {
        setApplicationId(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const urlId = searchParams?.get('id') || null
    if (urlId) {
      setApplicationId(urlId)
      return
    }
    if (typeof window !== 'undefined') {
      const sessionId = window.sessionStorage.getItem('lastApplicationId')
      if (sessionId) {
        setApplicationId(sessionId)
        return
      }
      const localId = window.localStorage.getItem('lastApplicationId')
      if (localId) {
        setApplicationId(localId)
        return
      }
    }
    setError('No application ID found. Please return to the application form.')
    setLoading(false)
  }, [searchParams])

  useEffect(() => {
    if (!applicationId) return;
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/applications/${applicationId}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setApplicationData({
          id: applicationId,
          date: new Date(data.createdAt).toLocaleDateString(),
          status: data.status || "in process",
          estimatedResponse: "3-5 business days",
          policyType: getPolicyType(data.policyId),
          company: getInsuranceCompany(data.policyId),
          plan: getPlanName(data.policyId),
          coverage: data.coverageAmount ? `$${parseInt(data.coverageAmount).toLocaleString()}` : "Not specified",
          premium: calculatePremium(data),
          startDate: data.startDate ? new Date(data.startDate).toLocaleDateString() : "Not specified",
          applicant: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            phone: data.phone || "Not provided"
          }
        });
      } catch (error) {
        setError('Failed to load application details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [applicationId]);

  const getPolicyType = (policyId: string) => {
    const policyMap: Record<string, string> = {
      'standard-policy': 'Standard Health Insurance',
      'premium-policy': 'Premium Health Coverage',
    };
    return policyMap[policyId] || "Health Insurance";
  };
  const getInsuranceCompany = (policyId: string) => {
    const companyMap: Record<string, string> = {
      'standard-policy': 'Acme Health Insurance',
      'premium-policy': 'Gold Star Insurance',
    };
    return companyMap[policyId] || "Insurance Provider";
  };
  const getPlanName = (policyId: string) => {
    const planMap: Record<string, string> = {
      'standard-policy': 'Basic Health Plan',
      'premium-policy': 'Premium Care Plan',
    };
    return planMap[policyId] || "Health Plan";
  };
  const calculatePremium = (data: any) => {
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
        </div>
      </div>
    )
  }
  // ...rest of your main content rendering (omitted for brevity, but copy from your original ConfirmationPage)
  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Application Confirmation</CardTitle>
            <CardDescription>Your application has been received and is under review.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Application Submitted Successfully!</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Your insurance application has been submitted. We'll review your information and get back to you shortly.
              </p>
              <div className="bg-muted/30 p-4 rounded-lg mb-6 w-full max-w-md">
                <h3 className="font-medium mb-2">Application Details</h3>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Application ID:</span>
                  <span className="text-sm font-medium">{applicationData.id}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Submitted On:</span>
                  <span className="text-sm font-medium">{applicationData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="text-sm font-medium text-amber-600">{applicationData.status}</span>
                </div>
              </div>
              <Button onClick={handleDownloadConfirmation}>Download Confirmation</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 