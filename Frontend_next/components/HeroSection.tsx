"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface HeroSectionProps {
  onGetStarted: () => void
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const floatingImages = [
    { src: "/images/health-insurance.png", alt: "Health Insurance", width: 150, height: 150, delay: 0, direction: 1 },
    { src: "/images/vehicle-insurance.png", alt: "Vehicle Insurance", width: 130, height: 130, delay: 0.5, direction: -1 },
    { src: "/images/home-insurance.png", alt: "Home Insurance", width: 120, height: 120, delay: 1, direction: 1 },
    { src: "/images/travel-insurance.png", alt: "Travel Insurance", width: 110, height: 110, delay: 2, direction: -1 },
  ]

  return (
    <section className="relative overflow-hidden py-20 md:py-32 w-full">
      {/* Floating Images (Watermark Effect) */}
      

      <div className="container relative z-10 mx-auto text-center w-full px-6">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Protect What Matters
          <br />
          Most
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl mb-6 text-muted-foreground text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          "Insurance is not about fear, it's about peace of mind. 
          Secure your future today with the right coverage."
        </motion.p>

        <motion.p
          className="text-lg md:text-xl mb-8 text-muted-foreground text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Discover tailored insurance solutions that fit your lifestyle and budget. 
          Get personalized recommendations in minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button size="lg" className="text-lg px-8 py-6" onClick={onGetStarted}>
            Get Started
          </Button>
        </motion.div>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background pointer-events-none" />
    </section>
  )
}
