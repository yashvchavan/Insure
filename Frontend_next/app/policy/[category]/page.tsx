"use client"
//import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Star, Shield, Award, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"

// Insurance category data

// useEffect(() => {
//   const fetchCompanies = async () => {
//     const res = await axios.get("http://localhost:4000/api/v1/users/policies",
//       {
//         withCredentials: true
//       }
//     );
   
//     setCompanies(res.data.data.allPolicies);
//     fetchCompanies();
//   }, [])
//   fetchCompanies();
// };
const categoryData = {
  health: {
    title: "Health Insurance",
    description: "Comprehensive coverage for medical expenses and healthcare needs",
    icon: "🏥",
    color: "from-red-500 to-pink-500",
    companies: [
      {
        id: "health-secure",
        name: "HealthSecure",
        rating: 4.8,
        featuredPolicy: "Comprehensive Health Coverage",
        coverage: "Full",
        startingAt: "₹100/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "medicare-plus",
        name: "MedicarePlus",
        rating: 4.7,
        featuredPolicy: "Premium Health Plan",
        coverage: "Full + Extras",
        startingAt: "₹120/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "health-guard",
        name: "HealthGuard",
        rating: 4.6,
        featuredPolicy: "Basic Health Insurance",
        coverage: "Standard",
        startingAt: "₹80/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "wellness-protect",
        name: "WellnessProtect",
        rating: 4.9,
        featuredPolicy: "Elite Health Protection",
        coverage: "Premium",
        startingAt: "₹150/month",
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  vehicle: {
    title: "Vehicle Insurance",
    description: "Protection for your car, bike, or commercial vehicles",
    icon: "🚗",
    color: "from-blue-500 to-cyan-500",
    companies: [
      {
        id: "drive-safe",
        name: "DriveSafe Insurance",
        rating: 4.7,
        featuredPolicy: "Comprehensive Auto Coverage",
        coverage: "Full",
        startingAt: "₹80/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "auto-shield",
        name: "AutoShield",
        rating: 4.5,
        featuredPolicy: "Premium Vehicle Protection",
        coverage: "Full + Extras",
        startingAt: "₹95/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "road-secure",
        name: "RoadSecure",
        rating: 4.6,
        featuredPolicy: "Basic Auto Insurance",
        coverage: "Standard",
        startingAt: "₹65/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "vehicle-guard",
        name: "VehicleGuard",
        rating: 4.8,
        featuredPolicy: "Elite Auto Protection",
        coverage: "Premium",
        startingAt: "₹110/month",
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  life: {
    title: "Life Insurance",
    description: "Financial security for your loved ones",
    icon: "💖",
    color: "from-purple-500 to-indigo-500",
    companies: [
      {
        id: "life-secure",
        name: "LifeSecure",
        rating: 4.9,
        featuredPolicy: "Term Life Premium",
        coverage: "₹2M",
        startingAt: "₹150/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "family-protect",
        name: "FamilyProtect",
        rating: 4.7,
        featuredPolicy: "Whole Life Coverage",
        coverage: "₹1.5M",
        startingAt: "₹180/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "future-guard",
        name: "FutureGuard",
        rating: 4.6,
        featuredPolicy: "Universal Life Plan",
        coverage: "₹1M",
        startingAt: "₹120/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "legacy-life",
        name: "Legacy Life Insurance",
        rating: 4.8,
        featuredPolicy: "Premium Life Protection",
        coverage: "₹3M",
        startingAt: "₹200/month",
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  home: {
    title: "Home Insurance",
    description: "Coverage for your home and belongings",
    icon: "🏠",
    color: "from-green-500 to-emerald-500",
    companies: [
      {
        id: "home-shield",
        name: "HomeShield",
        rating: 4.7,
        featuredPolicy: "Complete Home Protection",
        coverage: "Full Replacement",
        startingAt: "₹90/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "property-guard",
        name: "PropertyGuard",
        rating: 4.6,
        featuredPolicy: "Premium Property Coverage",
        coverage: "Full + Contents",
        startingAt: "₹110/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "dwelling-secure",
        name: "DwellingSecure",
        rating: 4.8,
        featuredPolicy: "Elite Home Insurance",
        coverage: "Comprehensive",
        startingAt: "₹130/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "residence-protect",
        name: "ResidenceProtect",
        rating: 4.5,
        featuredPolicy: "Basic Home Coverage",
        coverage: "Standard",
        startingAt: "₹75/month",
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  travel: {
    title: "Travel Insurance",
    description: "Protection during your trips and vacations",
    icon: "✈️",
    color: "from-yellow-500 to-amber-500",
    companies: [
      {
        id: "travel-safe",
        name: "TravelSafe",
        rating: 4.6,
        featuredPolicy: "Global Travel Protection",
        coverage: "Comprehensive",
        startingAt: "₹25/trip",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "journey-guard",
        name: "JourneyGuard",
        rating: 4.7,
        featuredPolicy: "Premium Travel Coverage",
        coverage: "Premium",
        startingAt: "₹35/trip",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "voyage-secure",
        name: "VoyageSecure",
        rating: 4.5,
        featuredPolicy: "Basic Travel Insurance",
        coverage: "Standard",
        startingAt: "₹15/trip",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "trip-protect",
        name: "TripProtect",
        rating: 4.8,
        featuredPolicy: "Elite Travel Shield",
        coverage: "All-Inclusive",
        startingAt: "₹45/trip",
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  business: {
    title: "Business Insurance",
    description: "Comprehensive coverage for your business",
    icon: "🏢",
    color: "from-orange-500 to-red-500",
    companies: [
      {
        id: "business-shield",
        name: "BusinessShield",
        rating: 4.8,
        featuredPolicy: "Complete Business Protection",
        coverage: "Comprehensive",
        startingAt: "₹200/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "enterprise-guard",
        name: "EnterpriseGuard",
        rating: 4.7,
        featuredPolicy: "Premium Business Coverage",
        coverage: "Full + Liability",
        startingAt: "₹250/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "commerce-secure",
        name: "CommerceSecure",
        rating: 4.6,
        featuredPolicy: "Standard Business Insurance",
        coverage: "Basic",
        startingAt: "₹150/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "biz-protect",
        name: "BizProtect",
        rating: 4.9,
        featuredPolicy: "Elite Business Shield",
        coverage: "All-Inclusive",
        startingAt: "₹300/month",
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  pet: {
    title: "Pet Insurance",
    description: "Healthcare coverage for your furry friends",
    icon: "🐾",
    color: "from-teal-500 to-green-500",
    companies: [
      {
        id: "pet-care",
        name: "PetCare Insurance",
        rating: 4.7,
        featuredPolicy: "Complete Pet Protection",
        coverage: "Comprehensive",
        startingAt: "₹30/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "furry-shield",
        name: "FurryShield",
        rating: 4.8,
        featuredPolicy: "Premium Pet Coverage",
        coverage: "Full + Wellness",
        startingAt: "₹40/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "pet-health",
        name: "PetHealth",
        rating: 4.6,
        featuredPolicy: "Basic Pet Insurance",
        coverage: "Standard",
        startingAt: "₹20/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "animal-protect",
        name: "AnimalProtect",
        rating: 4.9,
        featuredPolicy: "Elite Pet Shield",
        coverage: "All-Inclusive",
        startingAt: "₹50/month",
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  cyber: {
    title: "Cyber Insurance",
    description: "Protection against digital threats and data breaches",
    icon: "🔒",
    color: "from-violet-500 to-purple-500",
    companies: [
      {
        id: "cyber-shield",
        name: "CyberShield",
        rating: 4.8,
        featuredPolicy: "Complete Digital Protection",
        coverage: "Comprehensive",
        startingAt: "₹100/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "data-guard",
        name: "DataGuard",
        rating: 4.7,
        featuredPolicy: "Premium Cyber Coverage",
        coverage: "Full + Recovery",
        startingAt: "₹150/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "digital-secure",
        name: "DigitalSecure",
        rating: 4.6,
        featuredPolicy: "Basic Cyber Insurance",
        coverage: "Standard",
        startingAt: "₹75/month",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "cyber-protect",
        name: "CyberProtect",
        rating: 4.9,
        featuredPolicy: "Elite Digital Shield",
        coverage: "All-Inclusive",
        startingAt: "₹200/month",
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
}

export default function CategoryPage() {
  const params = useParams()
  const category = params?.category as string
  const [policies, setPolicies] = useState<any[]>([])

  useEffect(()=> {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:4000/api/v1/users/policies/all-policies`)
      const data = await response.json()
      setPolicies(data.data)
    }
    fetchData()
  } , [])

  // Get category data or default to health if not found
  const currentCategory = categoryData[category as keyof typeof categoryData] || categoryData.health

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className={`bg-gradient-to-r ₹{currentCategory.color} p-8 rounded-xl mb-10 text-white`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{currentCategory.icon}</div>
            <h1 className="text-3xl md:text-4xl font-bold">{currentCategory.title}</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl">{currentCategory.description}</p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Top Insurance Providers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((company) => (
              <motion.div key={company.id} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Link href={`/policy/${category}/${company._id}`}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                          <img
                            src={company.image || "/placeholder.svg"}
                            alt={company.name}
                            width={80}
                            height={80}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{company.name}</h3>
                          <div className="flex items-center text-amber-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="ml-1 text-sm">{company.rating}/5</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-start gap-2">
                          <Shield className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">{company.featuredPolicy}</p>
                            <p className="text-sm text-muted-foreground">Featured Policy</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Award className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">{company.coverage}</p>
                            <p className="text-sm text-muted-foreground">Coverage</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground">Starting at</p>
                          <p className="font-bold text-lg">{company.startingAt}</p>
                        </div>
                        <Button variant="ghost" className="gap-1">
                          View Plans <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-4">Why Choose {currentCategory.title}?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Comprehensive Coverage</h3>
                <p className="text-muted-foreground">
                  Get complete protection with our extensive coverage options tailored to your needs.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Affordable Premiums</h3>
                <p className="text-muted-foreground">
                  Find plans that fit your budget with competitive rates from top providers.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Fast Claims Processing</h3>
                <p className="text-muted-foreground">
                  Experience hassle-free claims with quick processing and responsive support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}