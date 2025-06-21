"use client"

import type React from "react"
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Minus, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import useAuth from "@/context/store";


export default function AddPolicyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { adminEmail } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    provider: "",
    // providerId: "",
    description: "",
    coverageAmount: "",
    premium: "",
    tenureYears: "",
    // paymentFrequency: "monthly",
    features: [""],
    requiredDocuments: [""],
    termsAndConditions: [""],
    isPopular: false,
    status: "active",
    createdBy: adminEmail,
    subcribers:0,
    revenue:0,
    // minAge: "",
    // maxAge: "",
    // waitingPeriod: "",
    // deductible: "",
    // copay: "",
    // maxCoverage: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData({
      ...formData,
      [field]: value,
    })
    // Clear error when field is modified
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      })
    }
  }

  const handleArrayInputChange = (field: string, index: number, value: string) => {
    const newArray = [...(formData[field as keyof typeof formData] as string[])]
    newArray[index] = value
    handleInputChange(field, newArray)
  }

  const addArrayItem = (field: string) => {
    const newArray = [...(formData[field as keyof typeof formData] as string[]), ""]
    handleInputChange(field, newArray)
  }

  const removeArrayItem = (field: string, index: number) => {
    const newArray = [...(formData[field as keyof typeof formData] as string[])]
    newArray.splice(index, 1)
    handleInputChange(field, newArray)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name) newErrors.name = "Policy name is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.provider) newErrors.provider = "Provider is required"
    // if (!formData.providerId) newErrors.providerId = "Provider ID is required"
    if (!formData.description) newErrors.description = "Description is required"
    if (!formData.coverageAmount) newErrors.coverageAmount = "Coverage amount is required"
    if (!formData.premium) newErrors.premium = "Premium is required"
    if (!formData.tenureYears) newErrors.tenureYears = "Tenure is required"
    if (formData.features.some((f) => !f)) newErrors.features = "All features must be filled"
    if (formData.requiredDocuments.some((d) => !d))
      newErrors.requiredDocuments = "All required documents must be filled"
    if (formData.termsAndConditions.some((t) => !t))
      newErrors.termsAndConditions = "All terms and conditions must be filled"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/create-policy', formData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        // Redirect to admin-dashboard with a success message
        router.push('/admin-dashboard?success=Policy+created+successfully');
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error saving policy:', error);
      setErrors({
        submit: 'There was an error saving the policy. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Add New Policy</h1>

          {errors.submit && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic details of the insurance policy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Policy Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter policy name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health">Health Insurance</SelectItem>
                        <SelectItem value="life">Life Insurance</SelectItem>
                        <SelectItem value="vehicle">Vehicle Insurance</SelectItem>
                        <SelectItem value="home">Home Insurance</SelectItem>
                        <SelectItem value="travel">Travel Insurance</SelectItem>
                        <SelectItem value="business">Business Insurance</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider Name</Label>
                    <Input
                      id="provider"
                      value={formData.provider}
                      onChange={(e) => handleInputChange("provider", e.target.value)}
                      placeholder="Enter insurance provider"
                      className={errors.provider ? "border-red-500" : ""}
                    />
                    {errors.provider && <p className="text-sm text-red-500">{errors.provider}</p>}
                  </div>

                  {/* <div className="space-y-2">
                    <Label htmlFor="providerId">Provider ID</Label>
                    <Input
                      id="providerId"
                      value={formData.providerId}
                      onChange={(e) => handleInputChange("providerId", e.target.value)}
                      placeholder="Enter provider ID"
                      className={errors.providerId ? "border-red-500" : ""}
                    />
                    {errors.providerId && <p className="text-sm text-red-500">{errors.providerId}</p>}
                  </div> */}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter policy description"
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Coverage & Pricing</CardTitle>
                <CardDescription>Define the coverage details and pricing structure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="coverageAmount">Coverage Amount</Label>
                    <Input
                      id="coverageAmount"
                      value={formData.coverageAmount}
                      onChange={(e) => handleInputChange("coverageAmount", e.target.value)}
                      placeholder="Enter coverage amount"
                      className={errors.coverageAmount ? "border-red-500" : ""}
                    />
                    {errors.coverageAmount && <p className="text-sm text-red-500">{errors.coverageAmount}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="premium">Premium Amount</Label>
                    <Input
                      id="premium"
                      value={formData.premium}
                      onChange={(e) => handleInputChange("premium", e.target.value)}
                      placeholder="Enter premium amount"
                      className={errors.premium ? "border-red-500" : ""}
                    />
                    {errors.premium && <p className="text-sm text-red-500">{errors.premium}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenureYears">Tenure (Years)</Label>
                    <Input
                      id="tenureYears"
                      type="number"
                      value={formData.tenureYears}
                      onChange={(e) => handleInputChange("tenureYears", e.target.value)}
                      placeholder="Enter tenure in years"
                      className={errors.tenureYears ? "border-red-500" : ""}
                    />
                    {errors.tenureYears && <p className="text-sm text-red-500">{errors.tenureYears}</p>}
                  </div>

                  {/* <div className="space-y-2">
                    <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                    <Select
                      value={formData.paymentFrequency}
                      onValueChange={(value) => handleInputChange("paymentFrequency", value)}
                    >
                      <SelectTrigger id="paymentFrequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="semi-annual">Semi-Annual</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}
                </div>

                {/* <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minAge">Minimum Age</Label>
                    <Input
                      id="minAge"
                      type="number"
                      value={formData.minAge}
                      onChange={(e) => handleInputChange("minAge", e.target.value)}
                      placeholder="Enter minimum age"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxAge">Maximum Age</Label>
                    <Input
                      id="maxAge"
                      type="number"
                      value={formData.maxAge}
                      onChange={(e) => handleInputChange("maxAge", e.target.value)}
                      placeholder="Enter maximum age"
                    />
                  </div>
                </div> */}

                
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Features & Benefits</CardTitle>
                <CardDescription>List the key features and benefits of the policy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleArrayInputChange("features", index, e.target.value)}
                      placeholder="Enter feature"
                      className={errors.features ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem("features", index)}
                      disabled={formData.features.length === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    {index === formData.features.length - 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => addArrayItem("features")}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {errors.features && <p className="text-sm text-red-500">{errors.features}</p>}
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Required Documents</CardTitle>
                <CardDescription>List all documents required for policy application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.requiredDocuments.map((doc, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={doc}
                      onChange={(e) => handleArrayInputChange("requiredDocuments", index, e.target.value)}
                      placeholder="Enter required document"
                      className={errors.requiredDocuments ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem("requiredDocuments", index)}
                      disabled={formData.requiredDocuments.length === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    {index === formData.requiredDocuments.length - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => addArrayItem("requiredDocuments")}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {errors.requiredDocuments && <p className="text-sm text-red-500">{errors.requiredDocuments}</p>}
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
                <CardDescription>Define the terms and conditions for the policy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.termsAndConditions.map((term, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={term}
                      onChange={(e) => handleArrayInputChange("termsAndConditions", index, e.target.value)}
                      placeholder="Enter term or condition"
                      className={errors.termsAndConditions ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem("termsAndConditions", index)}
                      disabled={formData.termsAndConditions.length === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    {index === formData.termsAndConditions.length - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => addArrayItem("termsAndConditions")}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {errors.termsAndConditions && <p className="text-sm text-red-500">{errors.termsAndConditions}</p>}
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Additional Settings</CardTitle>
                <CardDescription>Configure additional policy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="popular">Mark as Popular</Label>
                    <p className="text-sm text-muted-foreground">Feature this policy prominently on the website</p>
                  </div>
                  <Switch
                    id="popular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => handleInputChange("isPopular", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Policy Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Policy"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

