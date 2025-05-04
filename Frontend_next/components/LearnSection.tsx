"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, FileText, PieChart, Shield, Book, Video, Calculator } from "lucide-react"
import { useEffect, useState } from "react"

export default function LearnSection() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className="py-16 bg-muted/30 w-full">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Learn About Insurance</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Understanding insurance doesn't have to be complicated. Explore our educational resources to make informed
            decisions about your coverage needs.
          </p>
        </motion.div>

        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 gap-2">
            <TabsTrigger value="basics" className="py-2 px-4">
              <Shield className="h-4 w-4 mr-2" />
              Insurance Basics
            </TabsTrigger>
            <TabsTrigger value="types" className="py-2 px-4">
              <FileText className="h-4 w-4 mr-2" />
              Types of Coverage
            </TabsTrigger>
            <TabsTrigger value="claims" className="py-2 px-4">
              <Calculator className="h-4 w-4 mr-2" />
              Claims Process
            </TabsTrigger>
            <TabsTrigger value="tips" className="py-2 px-4">
              <PieChart className="h-4 w-4 mr-2" />
              Smart Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="relative aspect-video bg-muted rounded-md mb-4 overflow-hidden">
                    {isMounted ? (
                      <video
                        className="aspect-video bg-muted rounded-md mb-4"
                        controls
                      >
                        <source src="/videos/Insure_learn.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="aspect-video bg-muted rounded-md mb-4 flex items-center justify-center">
                        <Play className="h-12 w-12 text-primary/80" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">How Insurance Works</h3>
                  <p className="text-muted-foreground">
                    Learn the fundamental concepts of insurance, including premiums, deductibles, and coverage limits.
                    This video explains how insurance companies assess risk and calculate premiums.
                  </p>
                  <button className="mt-4 text-primary font-medium flex items-center">
                    Watch full video <Play className="h-4 w-4 ml-2" />
                  </button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-lg mb-2">Insurance Terminology</h4>
                        <p className="text-muted-foreground">
                          A comprehensive guide to common insurance terms and what they mean for you.
                        </p>
                        <button className="mt-3 text-primary text-sm font-medium">Read Guide →</button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <PieChart className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-lg mb-2">Risk Assessment</h4>
                        <p className="text-muted-foreground">
                          How insurance companies evaluate risk factors to determine your premium rates.
                        </p>
                        <button className="mt-3 text-primary text-sm font-medium">Learn More →</button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-lg mb-2">Coverage Explained</h4>
                        <p className="text-muted-foreground">
                          Understanding what is covered and what isn't in your insurance policy.
                        </p>
                        <button className="mt-3 text-primary text-sm font-medium">View Details →</button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="types">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  icon: "🏥", 
                  bg: "bg-red-100", 
                  title: "Health Insurance", 
                  description: "Coverage for medical expenses, including hospitalization, medication, and preventive care." 
                },
                { 
                  icon: "🚗", 
                  bg: "bg-blue-100", 
                  title: "Auto Insurance", 
                  description: "Protection against financial loss in case of accidents, theft, or damage to your vehicle." 
                },
                { 
                  icon: "🏠", 
                  bg: "bg-green-100", 
                  title: "Home Insurance", 
                  description: "Coverage for your home and personal belongings against damage, theft, and liability." 
                },
                { 
                  icon: "💖", 
                  bg: "bg-purple-100", 
                  title: "Life Insurance", 
                  description: "Financial protection for your loved ones in case of your death or disability." 
                },
                { 
                  icon: "✈️", 
                  bg: "bg-yellow-100", 
                  title: "Travel Insurance", 
                  description: "Coverage for unexpected events during travel, including medical emergencies and trip cancellations." 
                },
                { 
                  icon: "🏢", 
                  bg: "bg-orange-100", 
                  title: "Business Insurance", 
                  description: "Comprehensive coverage for businesses, including liability, property, and employee-related risks." 
                }
              ].map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className={`h-14 w-14 rounded-full ${item.bg} flex items-center justify-center mb-4 text-3xl`}>
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-grow">{item.description}</p>
                    <button className="text-primary text-sm font-medium self-start">
                      Explore coverage →
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="claims">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                    <Video className="h-16 w-16 text-primary z-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Claims Process Explained</h3>
                  <p className="text-muted-foreground">
                    A step-by-step guide on how to file a claim, what documents you need, and what to expect during the
                    process.
                  </p>
                  <button className="mt-4 text-primary font-medium flex items-center">
                    Watch tutorial <Play className="h-4 w-4 ml-2" />
                  </button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {[
                  {
                    icon: FileText,
                    title: "Required Documentation",
                    description: "Learn about the essential documents you need to prepare for a smooth claims process."
                  },
                  {
                    icon: Calculator,
                    title: "Claim Calculation",
                    description: "Understand how insurance companies calculate claim payouts and what factors affect your settlement."
                  },
                  {
                    icon: Book,
                    title: "Claim FAQs",
                    description: "Get answers to the most common questions about the claims process and resolution."
                  }
                ].map((item, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <item.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-lg mb-2">{item.title}</h4>
                          <p className="text-muted-foreground">{item.description}</p>
                          <button className="mt-3 text-primary text-sm font-medium">
                            Learn more →
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tips">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  iconColor: "text-green-600",
                  bg: "bg-green-100",
                  title: "Choosing the Right Coverage",
                  description: "Tips on how to assess your needs and select the most appropriate insurance coverage for your situation."
                },
                {
                  icon: Calculator,
                  iconColor: "text-blue-600",
                  bg: "bg-blue-100",
                  title: "Saving on Premiums",
                  description: "Strategies to reduce your insurance costs without compromising on essential coverage."
                },
                {
                  icon: FileText,
                  iconColor: "text-purple-600",
                  bg: "bg-purple-100",
                  title: "Understanding Your Policy",
                  description: "Key points to look for when reviewing your insurance policy and what common clauses mean."
                }
              ].map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow group">
                  <CardContent className="p-6">
                    <div className={`h-14 w-14 rounded-full ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    <button className="text-primary text-sm font-medium flex items-center">
                      Read tips <span className="ml-1">→</span>
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}