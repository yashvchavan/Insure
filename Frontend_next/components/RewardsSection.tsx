"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Award, Users, Star, X } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function RewardsSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedReward, setSelectedReward] = useState<number | null>(null)

  const rewards = [
    {
      icon: Gift,
      title: "Referral Bonuses",
      description: "Earn rewards for every friend or family member you refer who signs up for a policy.",
      points: 500,
      details: "For each successful referral, you'll receive 500 points that can be redeemed for premium discounts or gift cards. No limit on referrals!",
      action: "Share your referral link"
    },
    {
      icon: Award,
      title: "Loyalty Rewards",
      description: "Get exclusive discounts and benefits for each year you stay with us.",
      points: 1000,
      details: "Every policy anniversary earns you 1000 loyalty points. After 5 years, you'll unlock Gold status with additional benefits.",
      action: "View loyalty tiers"
    },
    {
      icon: Users,
      title: "Family Bundle",
      description: "Save more when you add multiple family members to your insurance plans.",
      points: 750,
      details: "Add 2+ family members to any policy to earn 750 points. Additional 250 points for each extra member beyond 2.",
      action: "Add family members"
    },
    {
      icon: Star,
      title: "Engagement Points",
      description: "Earn points for completing your profile, setting up auto-pay, and more.",
      points: 250,
      details: "Complete your profile (100 pts), setup auto-pay (150 pts), submit annual health check (200 pts), and more.",
      action: "See all activities"
    },
  ]

  const openRewardDetails = (index: number) => {
    setSelectedReward(index)
    setIsDialogOpen(true)
  }

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
            onClick={() => openRewardDetails(index)}
            className="cursor-pointer hover:shadow-lg transition-shadow"
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
          {/* Leaderboard section remains the same */}
          {/* Badges section remains the same */}
        </div>

        <div className="mt-8 text-center">
          <Button size="lg" onClick={() => setIsDialogOpen(true)}>Join Rewards Program</Button>
        </div>
      </div>

      {/* Reward Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          {selectedReward !== null ? (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle>
                      <div className="text-2xl flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {(() => {
                            const IconComponent = rewards[selectedReward].icon;
                            return <IconComponent className="h-5 w-5 text-primary" />;
                          })()}
                        </div>
                        {rewards[selectedReward].title}
                      </div>
                    </DialogTitle>
                    <div className="mt-2">
                      <DialogDescription>
                        {rewards[selectedReward].description}
                      </DialogDescription>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsDialogOpen(false)}
                    className="text-muted-foreground"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                  <span className="font-medium">Points Reward</span>
                  <span className="text-2xl font-bold text-primary">{rewards[selectedReward].points} pts</span>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">How it works</h4>
                  <p className="text-muted-foreground">{rewards[selectedReward].details}</p>
                </div>
                
                <div className="pt-4">
                  <Button className="w-full">{rewards[selectedReward].action}</Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <div className="text-2xl">
                  <DialogTitle>Join Our Rewards Program</DialogTitle>
                </div>
                <DialogDescription>
                  Start earning points today and unlock exclusive benefits
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg border">
                    <h4 className="font-semibold mb-2">Total Points</h4>
                    <p className="text-2xl font-bold text-primary">0</p>
                    <p className="text-sm text-muted-foreground mt-1">Start earning today</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg border">
                    <h4 className="font-semibold mb-2">Current Tier</h4>
                    <p className="text-2xl font-bold text-primary">Bronze</p>
                    <p className="text-sm text-muted-foreground mt-1">500 pts to Silver</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Program Benefits</h4>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>Earn points for everyday insurance activities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>Redeem points for premium discounts and gift cards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>Exclusive offers for members only</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>Badges and achievements to showcase your progress</span>
                    </li>
                  </ul>
                </div>
                
                <div className="pt-4">
                  <Button className="w-full">Enroll Now</Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    By joining, you agree to our Rewards Program Terms
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}