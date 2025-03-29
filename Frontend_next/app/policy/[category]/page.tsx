"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Star, Shield, Award, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react";
import useAuth from "@/context/store"
import axios from "axios"
import { useRouter } from "next/navigation";
import Image from "next/image";
// Add this helper function to ensure correct paths
const getImagePath = (imageName?: string) => {
  if (!imageName) return "/images/placeholder.png";
  return imageName.startsWith('/') ? imageName : `/images/${imageName}`;
};

// Update your category mapping
const CATEGORY_IMAGES: Record<string, string> = {
  health: getImagePath("health-insurance.png"),
  home: getImagePath("home-insurance.png"),
  travel: getImagePath("travel-insurance.png"),
};
// Type definitions
interface Company {
  id: string;
  name: string;
  rating: number;
  featuredPolicy: string;
  coverage: string;
  startingAt: string;
  image: string;
}

interface CategoryData {
  title: string;
  description: string;
  icon: string;
  color: string;
  companies: Company[];
}

type PolicyData = Record<string, CategoryData>;

export default function CategoryPage() {
  const params = useParams();
  const category = params?.category as string;
  const [categoryData, setCategoryData] = useState<PolicyData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/user-login");
    } else {
      fetchCategoryData();
    }
  }, [user]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get<PolicyData>('/api/get-all-policies');
      setCategoryData(response.data || {});
      setLoading(false);
    } catch (err) {
      console.error("Error fetching policies:", err);
      if (err instanceof Error) {
        setError(err.message || "Failed to fetch category data");
      } else {
        setError("Failed to fetch category data");
      }
      setLoading(false);
    }
  };

  const currentCategory = categoryData[category?.toLowerCase()] || categoryData.health;

  if (loading) return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  if (error) return <div className="flex justify-center items-center h-screen"><p>Error: {error}</p></div>;
  if (!currentCategory) return <div className="flex justify-center items-center h-screen"><p>No data available for this category</p></div>;

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className={`bg-gradient-to-r ${currentCategory.color} p-8 rounded-xl mb-10 text-white`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{currentCategory.icon}</div>
            <h1 className="text-3xl md:text-4xl font-bold">{currentCategory.title}</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl">{currentCategory.description}</p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Top Insurance Providers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCategory.companies?.map((company: Company) => (
              <motion.div key={company.id} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Link href={`/policy/${category}/${company.id}`}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        <Image
                          src={getImagePath(company.image) || `/images/${currentCategory}-insurance.png`}
                          alt={company.name}
                          width={80}
                          height={80}
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/placeholder.png";
                          }}
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