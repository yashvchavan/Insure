"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Calculator, IndianRupee, TrendingUp, Shield } from "lucide-react"

export default function CalculatorsSection() {
  const [premiumInputs, setPremiumInputs] = useState({
    age: 30,
    coverageAmount: 100000,
    term: 20,
    healthStatus: 85,
  })

  const [maturityInputs, setMaturityInputs] = useState({
    investmentAmount: 10000,
    interestRate: 8,
    years: 10,
  })

  const [riskInputs, setRiskInputs] = useState({
    age: 30,
    healthScore: 80,
    occupation: "office",
    lifestyle: 70,
  })

  const [premiumResult, setPremiumResult] = useState<number | null>(null)
  const [maturityResult, setMaturityResult] = useState<number | null>(null)
  const [riskResult, setRiskResult] = useState<string | null>(null)

  const calculatePremium = () => {
    // Simple premium calculation formula for demonstration
    const basePremium = (premiumInputs.coverageAmount / 1000) * 0.5
    const ageFactor = premiumInputs.age / 30
    const healthFactor = (100 - premiumInputs.healthStatus) / 50 + 0.5
    const termFactor = premiumInputs.term / 10

    const premium = basePremium * ageFactor * healthFactor * termFactor
    setPremiumResult(Math.round(premium * 100) / 100)
  }

  const calculateMaturity = () => {
    // Compound interest formula: A = P(1 + r/n)^(nt)
    const principal = maturityInputs.investmentAmount
    const rate = maturityInputs.interestRate / 100
    const time = maturityInputs.years

    const maturityAmount = principal * Math.pow(1 + rate, time)
    setMaturityResult(Math.round(maturityAmount * 100) / 100)
  }

  const calculateRisk = () => {
    // Simple risk assessment for demonstration
    const ageScore = 100 - (premiumInputs.age - 20)
    const healthScore = riskInputs.healthScore
    const occupationScore = riskInputs.occupation === "office" ? 90 : riskInputs.occupation === "field" ? 70 : 50
    const lifestyleScore = riskInputs.lifestyle

    const totalScore = (ageScore + healthScore + occupationScore + lifestyleScore) / 4

    let riskLevel = ""
    if (totalScore >= 80) {
      riskLevel = "Low Risk"
    } else if (totalScore >= 60) {
      riskLevel = "Moderate Risk"
    } else {
      riskLevel = "High Risk"
    }

    setRiskResult(riskLevel)
  }

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
          <h2 className="text-3xl font-bold mb-4">Insurance Calculators</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Use our interactive calculators to estimate premiums, maturity benefits, and assess your risk profile.
          </p>
        </motion.div>

        <Tabs defaultValue="premium" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="premium">Premium Calculator</TabsTrigger>
            <TabsTrigger value="maturity">Maturity Benefits</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="premium">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Calculator className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">Premium Calculator</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[premiumInputs.age]}
                          min={18}
                          max={70}
                          step={1}
                          onValueChange={(value) => setPremiumInputs({ ...premiumInputs, age: value[0] })}
                        />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">18</span>
                          <span className="text-sm font-medium">{premiumInputs.age} years</span>
                          <span className="text-sm text-muted-foreground">70</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Coverage Amount</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[premiumInputs.coverageAmount]}
                          min={50000}
                          max={1000000}
                          step={10000}
                          onValueChange={(value) => setPremiumInputs({ ...premiumInputs, coverageAmount: value[0] })}
                        />
                        <div suppressHydrationWarning className="flex justify-between">
                          <span className="text-sm text-muted-foreground">₹50,000</span>
                          <span className="text-sm font-medium">
                            ₹{premiumInputs.coverageAmount.toLocaleString('en-IN')}
                          </span>
                          <span className="text-sm text-muted-foreground">₹1,000,000</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Term Length (Years)</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[premiumInputs.term]}
                          min={5}
                          max={30}
                          step={5}
                          onValueChange={(value) => setPremiumInputs({ ...premiumInputs, term: value[0] })}
                        />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">5</span>
                          <span className="text-sm font-medium">{premiumInputs.term} years</span>
                          <span className="text-sm text-muted-foreground">30</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Health Status</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[premiumInputs.healthStatus]}
                          min={50}
                          max={100}
                          step={5}
                          onValueChange={(value) => setPremiumInputs({ ...premiumInputs, healthStatus: value[0] })}
                        />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Poor</span>
                          <span className="text-sm font-medium">{premiumInputs.healthStatus}%</span>
                          <span className="text-sm text-muted-foreground">Excellent</span>
                        </div>
                      </div>
                    </div>

                    <Button onClick={calculatePremium}>Calculate Premium</Button>
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg">
                    <IndianRupee className="h-12 w-12 text-primary mb-4" />
                    <h4 className="text-lg font-medium mb-2">Estimated Monthly Premium</h4>
                    {premiumResult !== null ? (
                      <div className="text-4xl font-bold text-primary">₹{premiumResult}</div>
                    ) : (
                      <p className="text-muted-foreground text-center">
                        Adjust the sliders and click Calculate to see your estimated premium
                      </p>
                    )}
                    {premiumResult !== null && (
                      <p className="text-sm text-muted-foreground mt-4 text-center">
                        This is an estimate based on the information provided. Actual premiums may vary based on
                        additional factors and underwriting.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maturity">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">Maturity Benefits Calculator</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Investment Amount</Label>
                      <Input
                        type="number"
                        value={maturityInputs.investmentAmount}
                        onChange={(e) =>
                          setMaturityInputs({ ...maturityInputs, investmentAmount: Number(e.target.value) })
                        }
                        min={1000}
                        max={1000000}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Annual Interest Rate (%)</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[maturityInputs.interestRate]}
                          min={4}
                          max={12}
                          step={0.5}
                          onValueChange={(value) => setMaturityInputs({ ...maturityInputs, interestRate: value[0] })}
                        />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">4%</span>
                          <span className="text-sm font-medium">{maturityInputs.interestRate}%</span>
                          <span className="text-sm text-muted-foreground">12%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Investment Period (Years)</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[maturityInputs.years]}
                          min={5}
                          max={30}
                          step={1}
                          onValueChange={(value) => setMaturityInputs({ ...maturityInputs, years: value[0] })}
                        />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">5</span>
                          <span className="text-sm font-medium">{maturityInputs.years} years</span>
                          <span className="text-sm text-muted-foreground">30</span>
                        </div>
                      </div>
                    </div>

                    <Button onClick={calculateMaturity}>Calculate Maturity Value</Button>
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg">
                    <IndianRupee className="h-12 w-12 text-primary mb-4" />
                    <h4 className="text-lg font-medium mb-2">Estimated Maturity Value</h4>
                    {maturityResult !== null ? (
                      <div className="text-4xl font-bold text-primary">₹{maturityResult.toLocaleString()}</div>
                    ) : (
                      <p className="text-muted-foreground text-center">
                        Adjust the values and click Calculate to see your estimated maturity value
                      </p>
                    )}
                    {maturityResult !== null && (
                      <p className="text-sm text-muted-foreground mt-4 text-center">
                        This calculation uses compound interest. Actual returns may vary based on market conditions and
                        policy terms.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">Risk Analysis Calculator</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[riskInputs.age]}
                          min={18}
                          max={70}
                          step={1}
                          onValueChange={(value) => setRiskInputs({ ...riskInputs, age: value[0] })}
                        />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">18</span>
                          <span className="text-sm font-medium">{riskInputs.age} years</span>
                          <span className="text-sm text-muted-foreground">70</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Health Score</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[riskInputs.healthScore]}
                          min={40}
                          max={100}
                          step={5}
                          onValueChange={(value) => setRiskInputs({ ...riskInputs, healthScore: value[0] })}
                        />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Poor</span>
                          <span className="text-sm font-medium">{riskInputs.healthScore}%</span>
                          <span className="text-sm text-muted-foreground">Excellent</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Occupation Risk</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={riskInputs.occupation === "office" ? "default" : "outline"}
                          onClick={() => setRiskInputs({ ...riskInputs, occupation: "office" })}
                          className="w-full"
                        >
                          Low Risk
                        </Button>
                        <Button
                          variant={riskInputs.occupation === "field" ? "default" : "outline"}
                          onClick={() => setRiskInputs({ ...riskInputs, occupation: "field" })}
                          className="w-full"
                        >
                          Medium Risk
                        </Button>
                        <Button
                          variant={riskInputs.occupation === "hazardous" ? "default" : "outline"}
                          onClick={() => setRiskInputs({ ...riskInputs, occupation: "hazardous" })}
                          className="w-full"
                        >
                          High Risk
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Lifestyle Score</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[riskInputs.lifestyle]}
                          min={40}
                          max={100}
                          step={5}
                          onValueChange={(value) => setRiskInputs({ ...riskInputs, lifestyle: value[0] })}
                        />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Risky</span>
                          <span className="text-sm font-medium">{riskInputs.lifestyle}%</span>
                          <span className="text-sm text-muted-foreground">Healthy</span>
                        </div>
                      </div>
                    </div>

                    <Button onClick={calculateRisk}>Analyze Risk</Button>
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg">
                    <Shield className="h-12 w-12 text-primary mb-4" />
                    <h4 className="text-lg font-medium mb-2">Risk Assessment</h4>
                    {riskResult !== null ? (
                      <div
                        className={`text-4xl font-bold ₹{
                          riskResult === "Low Risk"
                            ? "text-green-500"
                            : riskResult === "Moderate Risk"
                              ? "text-amber-500"
                              : "text-red-500"
                        }`}
                      >
                        {riskResult}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center">
                        Adjust the values and click Analyze to see your risk assessment
                      </p>
                    )}
                    {riskResult !== null && (
                      <p className="text-sm text-muted-foreground mt-4 text-center">
                        This assessment is based on the information provided. Insurance companies may use additional
                        factors for a comprehensive risk analysis.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

