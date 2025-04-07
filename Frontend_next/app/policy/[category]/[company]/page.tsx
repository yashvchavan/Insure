"use client"

import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, CheckCircle, Clock, Star, Users, Phone, Mail, ArrowRight } from "lucide-react"

// Sample company data - in a real app, this would come from a database or API
const companyData = {
  "acme-health": {
    name: "Acme Health Insurance",
    category: "health",
    logo: "/placeholder.svg?height=120&width=120",
    rating: 4.8,
    reviews: 1245,
    description:
      "Acme Health Insurance has been providing quality healthcare coverage for over 30 years. We offer a range of plans designed to meet the diverse needs of individuals and families.",
    contact: {
      phone: "+1 (800) 123-4567",
      email: "support@acmehealth.com",
      website: "www.acmehealth.com",
    },
    policies: [
      {
        id: "gold-health",
        name: "Gold Health Plan",
        description: "Comprehensive health coverage with low deductibles and extensive network access",
        coverage: "$1,000,000",
        premium: "$120/month",
        deductible: "$500",
        benefits: [
          "100% coverage for preventive care",
          "Low copays for doctor visits",
          "Prescription drug coverage",
          "Mental health services",
          "Maternity care",
          "Emergency services",
          "Hospital stays",
        ],
        popular: true,
      },
      {
        id: "silver-health",
        name: "Silver Health Plan",
        description: "Balanced coverage with moderate premiums and deductibles",
        coverage: "$750,000",
        premium: "$95/month",
        deductible: "$1,000",
        benefits: [
          "100% coverage for preventive care",
          "Moderate copays for doctor visits",
          "Prescription drug coverage",
          "Mental health services",
          "Emergency services",
          "Hospital stays",
        ],
        popular: false,
      },
      {
        id: "bronze-health",
        name: "Bronze Health Plan",
        description: "Basic coverage with lower premiums and higher deductibles",
        coverage: "$500,000",
        premium: "$70/month",
        deductible: "$2,000",
        benefits: [
          "100% coverage for preventive care",
          "Higher copays for doctor visits",
          "Basic prescription drug coverage",
          "Emergency services",
          "Hospital stays",
        ],
        popular: false,
      },
    ],
    testimonials: [
      {
        name: "Sarah Johnson",
        role: "Customer for 5 years",
        comment:
          "Acme Health Insurance has been a lifesaver for my family. Their coverage is comprehensive and their customer service is exceptional.",
        rating: 5,
      },
      {
        name: "Michael Chen",
        role: "Customer for 3 years",
        comment:
          "I've had nothing but positive experiences with Acme Health. Their claims process is smooth and they always pay promptly.",
        rating: 5,
      },
      {
        name: "Jessica Williams",
        role: "Customer for 2 years",
        comment: "The Gold Health Plan has been perfect for my needs. Great coverage at a reasonable price.",
        rating: 4,
      },
    ],
  },
  "drive-safe": {
    name: "DriveSafe Insurance",
    category: "vehicle",
    logo: "/placeholder.svg?height=120&width=120",
    rating: 4.7,
    reviews: 987,
    description:
      "DriveSafe Insurance provides reliable auto coverage with competitive rates and excellent customer service. We've been protecting drivers for over 25 years with customizable policies.",
    contact: {
      phone: "+1 (800) 456-7890",
      email: "support@drivesafe.com",
      website: "www.drivesafe.com",
    },
    policies: [
      {
        id: "comprehensive-auto",
        name: "Comprehensive Auto Coverage",
        description: "Complete protection for your vehicle with extensive coverage options",
        coverage: "Full Coverage",
        premium: "$80/month",
        deductible: "$500",
        benefits: [
          "Collision coverage",
          "Comprehensive coverage",
          "Liability protection",
          "Uninsured motorist coverage",
          "Roadside assistance",
          "Rental car reimbursement",
          "Personal injury protection",
        ],
        popular: true,
      },
      {
        id: "standard-auto",
        name: "Standard Auto Protection",
        description: "Balanced coverage with moderate premiums and deductibles",
        coverage: "Standard Coverage",
        premium: "$65/month",
        deductible: "$1,000",
        benefits: [
          "Collision coverage",
          "Liability protection",
          "Uninsured motorist coverage",
          "Basic roadside assistance",
          "Limited rental car reimbursement",
        ],
        popular: false,
      },
      {
        id: "basic-auto",
        name: "Basic Auto Insurance",
        description: "Essential coverage to meet legal requirements with affordable premiums",
        coverage: "Basic Coverage",
        premium: "$45/month",
        deductible: "$1,500",
        benefits: [
          "Liability protection",
          "Uninsured motorist coverage",
          "Basic property damage coverage",
          "Minimal personal injury protection",
        ],
        popular: false,
      },
    ],
    testimonials: [
      {
        name: "Robert Johnson",
        role: "Customer for 7 years",
        comment:
          "DriveSafe has been excellent. When I had an accident, they processed my claim quickly and without hassle.",
        rating: 5,
      },
      {
        name: "Emily Davis",
        role: "Customer for 4 years",
        comment:
          "I've saved so much money since switching to DriveSafe. Their rates are competitive and the coverage is great.",
        rating: 4,
      },
      {
        name: "David Wilson",
        role: "Customer for 2 years",
        comment:
          "The roadside assistance has been a lifesaver multiple times. Very happy with my comprehensive coverage.",
        rating: 5,
      },
    ],
  },
  "life-secure": {
    name: "LifeSecure",
    category: "life",
    logo: "/placeholder.svg?height=120&width=120",
    rating: 4.9,
    reviews: 1056,
    description:
      "LifeSecure offers premium life insurance solutions to protect what matters most. With over 40 years of experience, we provide financial security and peace of mind for you and your loved ones.",
    contact: {
      phone: "+1 (800) 789-0123",
      email: "support@lifesecure.com",
      website: "www.lifesecure.com",
    },
    policies: [
      {
        id: "term-life-premium",
        name: "Term Life Premium",
        description: "High-value term life insurance with flexible coverage periods",
        coverage: "$2,000,000",
        premium: "$150/month",
        term: "10, 20, or 30 years",
        benefits: [
          "High coverage amount",
          "Level premiums for the entire term",
          "Convertible to permanent insurance",
          "Accelerated death benefit",
          "Optional riders available",
          "No medical exam options for qualified applicants",
        ],
        popular: true,
      },
      {
        id: "whole-life",
        name: "Whole Life Coverage",
        description: "Permanent life insurance with cash value accumulation",
        coverage: "$1,000,000",
        premium: "$250/month",
        term: "Lifetime",
        benefits: [
          "Lifetime coverage",
          "Cash value growth",
          "Fixed premiums",
          "Dividend potential",
          "Loan options against cash value",
          "Estate planning benefits",
        ],
        popular: false,
      },
      {
        id: "universal-life",
        name: "Universal Life Plan",
        description: "Flexible permanent life insurance with adjustable premiums and benefits",
        coverage: "$1,500,000",
        premium: "$200/month",
        term: "Lifetime",
        benefits: [
          "Lifetime coverage",
          "Flexible premiums",
          "Adjustable death benefit",
          "Cash value growth potential",
          "Tax-advantaged growth",
          "Loan options against cash value",
        ],
        popular: false,
      },
    ],
    testimonials: [
      {
        name: "Thomas Anderson",
        role: "Customer for 10 years",
        comment:
          "LifeSecure has given my family peace of mind knowing they'll be taken care of financially if anything happens to me.",
        rating: 5,
      },
      {
        name: "Jennifer Martinez",
        role: "Customer for 6 years",
        comment:
          "The customer service at LifeSecure is exceptional. They helped me understand all my options and choose the right coverage.",
        rating: 5,
      },
      {
        name: "William Taylor",
        role: "Customer for 8 years",
        comment:
          "I appreciate the flexibility of my Universal Life Plan. It's adapted well as my financial situation has changed over the years.",
        rating: 4,
      },
    ],
  },
}

// Default company data for any company not in our sample data
const defaultCompanyData = {
  name: "Insurance Provider",
  category: "insurance",
  logo: "/placeholder.svg?height=120&width=120",
  rating: 4.5,
  reviews: 500,
  description: "This insurance provider offers quality coverage options to meet your needs.",
  contact: {
    phone: "+1 (800) 123-4567",
    email: "support@insurance.com",
    website: "www.insurance.com",
  },
  policies: [
    {
      id: "standard-policy",
      name: "Standard Policy",
      description: "Comprehensive coverage for your needs",
      coverage: "Full Coverage",
      premium: "$100/month",
      deductible: "$500",
      benefits: [
        "Comprehensive coverage",
        "24/7 customer support",
        "Fast claims processing",
        "Additional benefits available",
      ],
      popular: true,
    },
  ],
  testimonials: [
    {
      name: "John Doe",
      role: "Customer",
      comment: "Great service and coverage at a competitive price.",
      rating: 4,
    },
  ],
}

export default function CompanyPage() {
  const params = useParams()
  const router = useRouter()
  const { category, company } = params || {}

  // Get company data or use default if not found
  const currentCompany = companyData[company as keyof typeof companyData] || {
    ...defaultCompanyData,
    name:
      company
        ?.toString()
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ") || "Insurance Provider",
  }

  const handleApplyNow = (policyId: string) => {
    router.push(`/policy/${category}/${company}/apply?policy=${currentCompany.name}`)
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          <div className="md:w-1/3 flex flex-col items-center md:items-start">
            <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center overflow-hidden mb-4">
              <img
                src={currentCompany.logo || "/placeholder.svg"}
                alt={currentCompany.name}
                width={120}
                height={120}
                className="object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-center md:text-left">{currentCompany.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center text-amber-500 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(currentCompany.rating) ? "fill-current" : ""}`} />
                ))}
                <span className="ml-1 text-sm font-medium">{currentCompany.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({currentCompany.reviews} reviews)</span>
            </div>

            <div className="space-y-4 w-full">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{currentCompany.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>{currentCompany.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      <span>{currentCompany.contact.website}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="md:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle>About {currentCompany.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{currentCompany.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-bold text-lg">Trusted</h3>
                    <p className="text-sm text-center text-muted-foreground">By thousands of customers</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                    <Clock className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-bold text-lg">Fast Claims</h3>
                    <p className="text-sm text-center text-muted-foreground">Quick processing times</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                    <Award className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-bold text-lg">Award Winning</h3>
                    <p className="text-sm text-center text-muted-foreground">Recognized for excellence</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="policies" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="policies">Available Policies</TabsTrigger>
            <TabsTrigger value="testimonials">Customer Reviews</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="policies">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {currentCompany.policies.map((policy) => (
                <Card key={policy.id} className={policy.popular ? "border-primary" : ""}>
                  {policy.popular && (
                    <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{policy.name}</CardTitle>
                    <CardDescription>{policy.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-muted-foreground">Coverage</span>
                        <span className="font-bold">{policy.coverage}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-muted-foreground">Premium</span>
                        <span className="font-bold">{policy.premium}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-muted-foreground">Deductible</span>
                        <span className="font-bold">{'deductible' in policy ? policy.deductible : policy.term}</span>
                      </div>

                      <div className="pt-2">
                        <h4 className="font-medium mb-2">Key Benefits</h4>
                        <ul className="space-y-2">
                          {policy.benefits.slice(0, 4).map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                              <span className="text-sm">{benefit}</span>
                            </li>
                          ))}
                          {policy.benefits.length > 4 && (
                            <li className="text-sm text-primary">+ {policy.benefits.length - 4} more benefits</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button className="w-full" onClick={() => handleApplyNow(policy.id)}>
                      Apply Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="testimonials">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCompany.testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center text-amber-500 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? "fill-current" : ""}`} />
                      ))}
                    </div>
                    <p className="italic mb-4">"{testimonial.comment}"</p>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold">How do I file a claim?</h3>
                  <p className="text-muted-foreground">
                    You can file a claim online through our customer portal, by calling our claims hotline, or through
                    our mobile app. Our claims process is designed to be simple and efficient.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">What documents do I need to apply?</h3>
                  <p className="text-muted-foreground">
                    For most policies, you'll need identification (driver's license or passport), relevant information
                    about what you're insuring, and payment information. Specific policies may require additional
                    documentation.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">How long does the application process take?</h3>
                  <p className="text-muted-foreground">
                    Most applications can be completed in 15-20 minutes. Depending on the policy type, you may receive
                    instant approval or it may take 1-3 business days for underwriting review.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">Can I customize my policy?</h3>
                  <p className="text-muted-foreground">
                    Yes, we offer various customization options and riders that can be added to your policy to meet your
                    specific needs. Speak with an agent to learn about all available options.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">Are there any discounts available?</h3>
                  <p className="text-muted-foreground">
                    We offer multiple discounts including multi-policy, good driver, good student, and loyalty
                    discounts. Check with an agent to see which discounts you qualify for.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-10 bg-muted/30 rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
              <p className="text-muted-foreground">Apply now to get coverage from {currentCompany.name}</p>
            </div>
            <Button size="lg" onClick={() => handleApplyNow(currentCompany.policies[0].id)}>
              Apply Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function Globe(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

