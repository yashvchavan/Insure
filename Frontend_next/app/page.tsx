"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import HeroSection from "@/components/HeroSection"
import PolicyCategories from "@/components/PolicyCategories"
import LearnSection from "@/components/LearnSection"
import CalculatorsSection from "@/components/CalculatorsSection"
import AboutSection from "@/components/AboutSection"
import RewardsSection from "@/components/RewardsSection"
import PolicyRecommendationForm from "@/components/PolicyRecommendationForm"
import Footer from "@/components/Footer"
import PdfSummarizerFrontend from "@/components/ui/PdfSummarizerFrontend" // Import PDF Summarizer component


export default function Home() {
  const [showRecommendationForm, setShowRecommendationForm] = useState(false)

  return (
    <div className="bg-gradient-to-b from-background to-background/80 flex flex-col items-center justify-center">
      <HeroSection onGetStarted={() => setShowRecommendationForm(true)} />

      {showRecommendationForm && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowRecommendationForm(false)}
        >
          <motion.div
            className="bg-card max-w-2xl w-full rounded-xl shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <PolicyRecommendationForm onClose={() => setShowRecommendationForm(false)} />
          </motion.div>
        </motion.div>
      )}

      <PolicyCategories />
      <LearnSection />
      <CalculatorsSection />
      <AboutSection />
      <RewardsSection />
      <div className="w-full">
        <Footer />
      </div>
    </div>
  )
}
