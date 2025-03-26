"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Zap, Lock, Award } from "lucide-react"

export default function AboutSection() {
  const features = [
    {
      icon: Shield,
      title: "Comprehensive Coverage",
      description: "Our policies provide extensive protection for all your insurance needs.",
    },
    {
      icon: Zap,
      title: "Fast Claims Processing",
      description: "Get your claims processed quickly with our streamlined system.",
    },
    {
      icon: Lock,
      title: "Secure Document Storage",
      description: "Keep all your important documents safe in our encrypted vault.",
    },
    {
      icon: Award,
      title: "Award-Winning Service",
      description: "Our customer service has been recognized for excellence in the industry.",
    },
  ]

  return (
    <section className="py-16 container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">About InsureEase</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We're on a mission to make insurance simple, affordable, and accessible for everyone.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-4">Why Choose Us</h3>
          <p className="text-muted-foreground mb-6">
            InsureEase stands out from traditional insurance providers by leveraging technology to create a seamless,
            user-friendly experience. Our platform combines AI-powered recommendations with human expertise to ensure
            you get the perfect coverage for your needs.
          </p>
          <p className="text-muted-foreground">
            With transparent pricing, no hidden fees, and 24/7 support, we're changing the way people think about
            insurance. Join thousands of satisfied customers who have already made the switch to InsureEase.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-muted/30 rounded-lg p-6"
        >
          <h3 className="text-2xl font-bold mb-4">How It Works</h3>
          <ol className="space-y-4">
            <li className="flex items-start">
              <span className="flex h-6 w-6 rounded-full bg-primary text-primary-foreground items-center justify-center text-sm font-medium mr-3">
                1
              </span>
              <div>
                <h4 className="font-medium">Choose a Policy</h4>
                <p className="text-sm text-muted-foreground">
                  Browse our range of insurance policies or get personalized recommendations.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex h-6 w-6 rounded-full bg-primary text-primary-foreground items-center justify-center text-sm font-medium mr-3">
                2
              </span>
              <div>
                <h4 className="font-medium">Fill in the Details</h4>
                <p className="text-sm text-muted-foreground">
                  Provide the necessary information through our simple forms.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex h-6 w-6 rounded-full bg-primary text-primary-foreground items-center justify-center text-sm font-medium mr-3">
                3
              </span>
              <div>
                <h4 className="font-medium">Get Approved</h4>
                <p className="text-sm text-muted-foreground">
                  Receive instant approval for most policies and start your coverage immediately.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex h-6 w-6 rounded-full bg-primary text-primary-foreground items-center justify-center text-sm font-medium mr-3">
                4
              </span>
              <div>
                <h4 className="font-medium">Manage Everything Online</h4>
                <p className="text-sm text-muted-foreground">
                  Access your policies, file claims, and store documents in your secure dashboard.
                </p>
              </div>
            </li>
          </ol>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

