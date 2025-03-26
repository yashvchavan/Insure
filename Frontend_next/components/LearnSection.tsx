"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, FileText, PieChart, Shield, Book, Video, Calculator } from "lucide-react"

export default function LearnSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Learn About Insurance</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Understanding insurance doesn't have to be complicated. Explore our educational resources to make informed
            decisions.
          </p>
        </motion.div>

        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="basics">Insurance Basics</TabsTrigger>
            <TabsTrigger value="types">Types of Coverage</TabsTrigger>
            <TabsTrigger value="claims">Claims Process</TabsTrigger>
            <TabsTrigger value="tips">Smart Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="basics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <video
                    className="aspect-video bg-muted rounded-md mb-4"
                    controls
                  >
                    <source src="/videos/Insure_learn.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <h3 className="text-xl font-bold mb-2">How Insurance Works</h3>
                  <p className="text-muted-foreground">
                    Learn the fundamental concepts of insurance, including premiums, deductibles, and coverage limits.
                    This video explains how insurance companies assess risk and calculate premiums.
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium mb-1">Insurance Terminology</h4>
                      <p className="text-sm text-muted-foreground">
                        A comprehensive guide to common insurance terms and what they mean for you.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start gap-3">
                    <PieChart className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium mb-1">Risk Assessment</h4>
                      <p className="text-sm text-muted-foreground">
                        How insurance companies evaluate risk factors to determine your premium rates.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium mb-1">Coverage Explained</h4>
                      <p className="text-sm text-muted-foreground">
                        Understanding what is covered and what isn't in your insurance policy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="types">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <span className="text-2xl">🏥</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Health Insurance</h3>
                  <p className="text-sm text-muted-foreground">
                    Coverage for medical expenses, including hospitalization, medication, and preventive care.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <span className="text-2xl">🚗</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Auto Insurance</h3>
                  <p className="text-sm text-muted-foreground">
                    Protection against financial loss in case of accidents, theft, or damage to your vehicle.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Home Insurance</h3>
                  <p className="text-sm text-muted-foreground">
                    Coverage for your home and personal belongings against damage, theft, and liability.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <span className="text-2xl">💖</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Life Insurance</h3>
                  <p className="text-sm text-muted-foreground">
                    Financial protection for your loved ones in case of your death or disability.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                    <span className="text-2xl">✈️</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Travel Insurance</h3>
                  <p className="text-sm text-muted-foreground">
                    Coverage for unexpected events during travel, including medical emergencies and trip cancellations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Business Insurance</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive coverage for businesses, including liability, property, and employee-related risks.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="claims">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                    <Video className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Claims Process Explained</h3>
                  <p className="text-muted-foreground">
                    A step-by-step guide on how to file a claim, what documents you need, and what to expect during the
                    process.
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium mb-1">Required Documentation</h4>
                      <p className="text-sm text-muted-foreground">
                        Learn about the essential documents you need to prepare for a smooth claims process.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start gap-3">
                    <Calculator className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium mb-1">Claim Calculation</h4>
                      <p className="text-sm text-muted-foreground">
                        Understand how insurance companies calculate claim payouts and what factors affect your
                        settlement.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start gap-3">
                    <Book className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium mb-1">Claim FAQs</h4>
                      <p className="text-sm text-muted-foreground">
                        Get answers to the most common questions about the claims process and resolution.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tips">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Choosing the Right Coverage</h3>
                  <p className="text-sm text-muted-foreground">
                    Tips on how to assess your needs and select the most appropriate insurance coverage for your
                    situation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Calculator className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Saving on Premiums</h3>
                  <p className="text-sm text-muted-foreground">
                    Strategies to reduce your insurance costs without compromising on essential coverage.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Understanding Your Policy</h3>
                  <p className="text-sm text-muted-foreground">
                    Key points to look for when reviewing your insurance policy and what common clauses mean.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

