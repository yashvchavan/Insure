"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Award, Users, Star, X, Share2, Mail, MessageSquare, Clipboard, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"

export default function RewardsSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedReward, setSelectedReward] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("program")
  const [referralLink, setReferralLink] = useState("https://insure.com/refer/yash-chavan")
  const [isCopied, setIsCopied] = useState(false)
  const [inviteEmails, setInviteEmails] = useState("")

  const rewards = [
    {
      icon: Gift,
      title: "Referral Bonuses",
      description: "Earn rewards for every friend or family member you refer who signs up for a policy.",
      points: 500,
      details: "For each successful referral, you'll receive 500 points that can be redeemed for premium discounts or gift cards. No limit on referrals!",
      action: "Invite Friends Now",
      steps: [
        "Share your unique referral link",
        "Friend signs up using your link",
        "Friend purchases a policy",
        "You get 500 points!"
      ]
    },
    {
      icon: Award,
      title: "Loyalty Rewards",
      description: "Get exclusive discounts and benefits for each year you stay with us.",
      points: 1000,
      details: "Every policy anniversary earns you 1000 loyalty points. After 5 years, you'll unlock Gold status with additional benefits.",
      action: "View loyalty tiers",
      tiers: [
        { name: "Bronze", points: 0, benefits: ["5% discount"] },
        { name: "Silver", points: 5000, benefits: ["10% discount", "Dedicated agent"] },
        { name: "Gold", points: 15000, benefits: ["15% discount", "Priority support", "Free annual checkup"] }
      ]
    },
    {
      icon: Users,
      title: "Family Bundle",
      description: "Save more when you add multiple family members to your insurance plans.",
      points: 750,
      details: "Add 2+ family members to any policy to earn 750 points. Additional 250 points for each extra member beyond 2.",
      action: "Add family members",
      eligible: ["Spouse", "Children", "Parents", "Siblings"]
    },
    {
      icon: Star,
      title: "Engagement Points",
      description: "Earn points for completing your profile, setting up auto-pay, and more.",
      points: 250,
      details: "Complete your profile (100 pts), setup auto-pay (150 pts), submit annual health check (200 pts), and more.",
      action: "See all activities",
      activities: [
        { name: "Complete Profile", points: 100, completed: true },
        { name: "Setup Auto-Pay", points: 150, completed: false },
        { name: "Health Check", points: 200, completed: false },
        { name: "Annual Review", points: 300, completed: false }
      ]
    },
  ]

  const leaderboard = [
    { rank: 1, name: "Yash Chavan", points: 12450, progress: 100 },
    { rank: 2, name: "Anuj Dhamne", points: 10875, progress: 87 },
    { rank: 3, name: "Ajinkya Suryawanshi", points: 9320, progress: 75 },
    { rank: 4, name: "Priya Patel", points: 8450, progress: 68 },
    { rank: 5, name: "Rahul Sharma", points: 7620, progress: 61 }
  ]

  const badges = [
    { icon: Award, name: "Early Bird", color: "green", earned: true },
    { icon: Users, name: "Family Protector", color: "blue", earned: true },
    { icon: Star, name: "Premium Member", color: "amber", earned: true },
    { icon: Gift, name: "Super Referrer", color: "purple", earned: false },
    { icon: Award, name: "Claim-Free Year", color: "red", earned: false },
    { icon: Star, name: "Loyalty Champion", color: "emerald", earned: false }
  ]

  const openRewardDetails = (index: number) => {
    setSelectedReward(index)
    setIsDialogOpen(true)
    setActiveTab("details")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send these emails to your backend
    alert(`Invites sent to: ${inviteEmails}`)
    setInviteEmails("")
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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">Leaderboard</h3>
            <p className="text-muted-foreground mb-6">
              Compete with other members to earn the most points and climb the leaderboard.
            </p>
            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${
                      user.rank === 1 ? "bg-primary text-primary-foreground" : 
                      user.rank === 2 ? "bg-primary/80 text-primary-foreground" : 
                      user.rank === 3 ? "bg-primary/60 text-primary-foreground" : "bg-muted"
                    }`}>
                      {user.rank}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold">{user.points.toLocaleString()} pts</span>
                    <Progress value={user.progress} className="w-20 h-2 hidden sm:block" />
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-bold">
                    8
                  </div>
                  <span className="font-medium">You</span>
                </div>
                <span className="font-bold">2,450 pts</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">Your Badges</h3>
            <p className="text-muted-foreground mb-6">
              Unlock badges as you reach milestones and complete challenges.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {badges.map((badge, index) => (
                <div key={index} className={`flex flex-col items-center p-3 bg-background rounded-lg border ${
                  !badge.earned ? "opacity-40" : ""
                }`}>
                  <div className={`h-12 w-12 rounded-full bg-${badge.color}-100 flex items-center justify-center mb-2`}>
                    <badge.icon className={`h-6 w-6 text-${badge.color}-600`} />
                  </div>
                  <span className="text-sm font-medium text-center">{badge.name}</span>
                  {badge.earned && (
                    <Badge variant="secondary" className="mt-2 text-xs">Earned</Badge>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-8 text-center">
          <Button size="lg" onClick={() => {
            setIsDialogOpen(true)
            setActiveTab("program")
          }}>
            Join Rewards Program
          </Button>
        </div>
      </div>

      {/* Reward Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="invite" disabled={selectedReward !== 0}>
                    Invite Friends
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                      <span className="font-medium">Points Reward</span>
                      <span className="text-2xl font-bold text-primary">
                        {rewards[selectedReward].points} pts
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">How it works</h4>
                      <p className="text-muted-foreground">{rewards[selectedReward].details}</p>
                    </div>

                    {selectedReward === 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Steps to earn</h4>
                        <ul className="space-y-3">
                          {rewards[selectedReward].steps?.map((step, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                                <span className="text-sm font-bold text-primary">{i + 1}</span>
                              </div>
                              <span className="text-muted-foreground">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedReward === 1 && (
                      <div>
                        <h4 className="font-semibold mb-2">Loyalty Tiers</h4>
                        <div className="space-y-4">
                          {rewards[selectedReward].tiers?.map((tier, i) => (
                            <div key={i} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="font-bold">{tier.name}</h5>
                                <span className="text-sm text-muted-foreground">
                                  {tier.points > 0 ? `${tier.points.toLocaleString()} pts` : "Starting tier"}
                                </span>
                              </div>
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                {tier.benefits.map((benefit, j) => (
                                  <li key={j} className="flex items-center gap-2">
                                    <ChevronRight className="h-4 w-4 text-primary" />
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <Button className="w-full">{rewards[selectedReward].action}</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="invite">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Your Referral Link</h4>
                      <div className="flex gap-2">
                        <Input value={referralLink} readOnly className="flex-1" />
                        <Button onClick={copyToClipboard} variant="outline">
                          {isCopied ? "Copied!" : <Clipboard className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Share via</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <Button variant="outline" className="flex flex-col h-auto py-3 gap-2">
                          <Mail className="h-5 w-5" />
                          <span className="text-xs">Email</span>
                        </Button>
                        <Button variant="outline" className="flex flex-col h-auto py-3 gap-2">
                          <MessageSquare className="h-5 w-5" />
                          <span className="text-xs">Messenger</span>
                        </Button>
                        <Button variant="outline" className="flex flex-col h-auto py-3 gap-2">
                          <Share2 className="h-5 w-5" />
                          <span className="text-xs">Other</span>
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Invite by Email</h4>
                      <form onSubmit={handleInviteSubmit} className="space-y-3">
                        <Input 
                          placeholder="Enter emails separated by commas" 
                          value={inviteEmails}
                          onChange={(e) => setInviteEmails(e.target.value)}
                        />
                        <Button type="submit" className="w-full">Send Invitations</Button>
                      </form>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-semibold mb-2">Your Referral Progress</h4>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">3 successful referrals</span>
                        <span className="font-bold text-primary">1,500 pts</span>
                      </div>
                      <Progress value={60} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        Refer 2 more friends to unlock the Super Referrer badge!
                      </p>
                    </div>
                  </div>
                </TabsContent>
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
                
                <TabsContent value="program">
                  <div className="space-y-6">
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
                        <li className="flex items-start gap-2">
                          <Star className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                          <span>Refer friends and earn bonus points</span>
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
                </TabsContent>
              </>
            )}
          </Tabs>
        </DialogContent>
      </Dialog>
    </section>
  )
}