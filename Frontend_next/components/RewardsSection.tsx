"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Award, Users, Star } from "lucide-react"

export default function RewardsSection() {
  const rewards = [
    {
      icon: Gift,
      title: "Referral Bonuses",
      description: "Earn rewards for every friend or family member you refer who signs up for a policy.",
      points: 500,
    },
    {
      icon: Award,
      title: "Loyalty Rewards",
      description: "Get exclusive discounts and benefits for each year you stay with us.",
      points: 1000,
    },
    {
      icon: Users,
      title: "Family Bundle",
      description: "Save more when you add multiple family members to your insurance plans.",
      points: 750,
    },
    {
      icon: Star,
      title: "Engagement Points",
      description: "Earn points for completing your profile, setting up auto-pay, and more.",
      points: 250,
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
        <h2 className="text-3xl font-bold mb-4">Rewards & Gamification</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Earn points, unlock badges, and get rewarded for being a responsible insurance customer.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {rewards.map((reward, index) => (
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
                  <reward.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{reward.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Earn up to</span>
                  <span className="text-lg font-bold text-primary">{reward.points} points</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="bg-muted/30 rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">Leaderboard</h3>
            <p className="text-muted-foreground mb-6">
              Compete with other members to earn the most points and climb the leaderboard. Top performers receive
              exclusive rewards and recognition.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-3">
                    1
                  </div>
                  <span className="font-medium">Yash Chavan</span>
                </div>
                <span className="font-bold">12,450 pts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/80 flex items-center justify-center text-primary-foreground font-bold mr-3">
                    2
                  </div>
                  <span className="font-medium">Anuj Dhamne</span>
                </div>
                <span className="font-bold">10,875 pts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/60 flex items-center justify-center text-primary-foreground font-bold mr-3">
                    3 
                  </div>
                  <span className="font-medium">Ajinkya Suryawanshi</span>
                </div>
                <span className="font-bold">9,320 pts</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">Badges & Achievements</h3>
            <p className="text-muted-foreground mb-6">
              Unlock badges as you reach milestones and complete challenges. Display your achievements on your profile.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-3 bg-background rounded-lg border">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-center">Early Bird</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-background rounded-lg border">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-center">Family Protector</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-background rounded-lg border">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-center">Premium Member</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-background rounded-lg border opacity-40">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <Gift className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-center">Super Referrer</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-background rounded-lg border opacity-40">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                  <Award className="h-6 w-6 text-red-600" />
                </div>
                <span className="text-sm font-medium text-center">Claim-Free Year</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-background rounded-lg border opacity-40">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-center">Loyalty Champion</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 text-center">
          <Button size="lg">Join Rewards Program</Button>
        </div>
      </div>
    </section>
  )
}

