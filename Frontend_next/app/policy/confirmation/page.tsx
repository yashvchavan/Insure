"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Home, Mail, Phone } from "lucide-react"

export default function ConfirmationPage() {
  const router = useRouter()

  // In a real app, this data would come from the server or be passed via state management
  const applicationData = {
    id: `APP-${Math.floor(Math.random() * 1000000)}`,
    date: new Date().toLocaleDateString(),
    status: "Under Review",
    estimatedResponse: "3-5 business days",
    policyType: "Health Insurance",
    company: "Acme Health Insurance",
    plan: "Gold Health Plan",
    coverage: "$1,000,000",
    premium: "$120/month",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 7 days from now
    applicant: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
    },
  }

  const handleDownloadConfirmation = () => {
    // In a real app, this would generate and download a PDF
    alert("Downloading confirmation PDF...")
  }

  const handleReturnHome = () => {
    router.push("/")
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

