"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    id: "health",
    title: "Health Insurance",
    description: "Comprehensive coverage for medical expenses",
    icon: "🏥",
    color: "from-red-500 to-pink-500",
  },
  {
    id: "vehicle",
    title: "Vehicle Insurance",
    description: "Protection for your car, bike, or commercial vehicles",
    icon: "🚗",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "life",
    title: "Life Insurance",
    description: "Financial security for your loved ones",
    icon: "💖",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "home",
    title: "Home Insurance",
    description: "Coverage for your home and belongings",
    icon: "🏠",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "travel",
    title: "Travel Insurance",
    description: "Protection during your trips and vacations",
    icon: "✈️",
    color: "from-yellow-500 to-amber-500",
  },
  {
    id: "business",
    title: "Business Insurance",
    description: "Comprehensive coverage for your business",
    icon: "🏢",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "pet",
    title: "Pet Insurance",
    description: "Healthcare coverage for your furry friends",
    icon: "🐾",
    color: "from-teal-500 to-green-500",
  },
  {
    id: "cyber",
    title: "Cyber Insurance",
    description: "Protection against digital threats and data breaches",
    icon: "🔒",
    color: "from-violet-500 to-purple-500",
  },
]

export default function PolicyCategories() {
  const [expanded, setExpanded] = useState(false)
  const visibleCategories = expanded ? categories : categories.slice(0, 6)

  return (
    <section className="py-16 container">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Insurance Categories</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our wide range of insurance policies designed to protect what matters most to you
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {visibleCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={`/policy/${category.id}`}>
                <Card className="h-full overflow-hidden group hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className={`bg-gradient-to-r ${category.color} p-6 h-full flex flex-col`}>
                      <div className="text-4xl mb-4">{category.icon}</div>
                      <h3 className="text-xl font-bold mb-2 text-white">{category.title}</h3>
                      <p className="text-white/80 mb-4">{category.description}</p>
                      <div className="mt-auto">
                        <span className="text-sm font-medium text-white inline-flex items-center group-hover:underline">
                          Learn More
                          <ChevronDown className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" onClick={() => setExpanded(!expanded)} className="gap-2">
          {expanded ? (
            <>
              Show Less <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              See More <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </section>
  )
}

