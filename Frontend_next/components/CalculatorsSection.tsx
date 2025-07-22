"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calculator, IndianRupee, TrendingUp, Shield } from "lucide-react";

export default function CalculatorsSection() {
  const [premiumInputs, setPremiumInputs] = useState({
    age: 30,
    coverageAmount: 100000,
    term: 20,
    healthStatus: 85,
  });

  const [maturityInputs, setMaturityInputs] = useState({
    investmentAmount: 10000,
    interestRate: 8,
    years: 10,
  });

  const [riskInputs, setRiskInputs] = useState({
    age: 30,
    healthScore: 80,
    occupation: "office",
    lifestyle: 70,
  });

  const [premiumResult, setPremiumResult] = useState<number | null>(null);
  const [maturityResult, setMaturityResult] = useState<number | null>(null);
  const [riskResult, setRiskResult] = useState<string | null>(null);

  // 🔁 Premium Formula: Base premium * age factor * health modifier * term multiplier
  const calculatePremium = () => {
    const { age, coverageAmount, term, healthStatus } = premiumInputs;

    const baseRate = 0.003; // ₹3 per ₹1000 sum assured
    const basePremium = (coverageAmount / 1000) * baseRate * 12; // Annual rate → Monthly

    const ageFactor = 1 + (age - 30) * 0.02; // Increase 2% per year over 30
    const healthModifier = (100 - healthStatus) / 100 + 1; // Poorer health increases premium
    const termFactor = term / 20; // Normalized to 20-year term

    const premium = basePremium * ageFactor * healthModifier * termFactor;
    setPremiumResult(Math.round(premium));
  };

  // 📈 Compound Interest: A = P * (1 + r)^t
  const calculateMaturity = () => {
    const { investmentAmount, interestRate, years } = maturityInputs;
    const rate = interestRate / 100;
    const maturityAmount = investmentAmount * Math.pow(1 + rate, years);
    setMaturityResult(Math.round(maturityAmount));
  };

  // 🛡️ Risk Analysis
  const calculateRisk = () => {
    const { age, healthScore, occupation, lifestyle } = riskInputs;

    const ageScore = age < 30 ? 90 : age < 45 ? 75 : age < 60 ? 60 : 45;
    const occupationScore =
      occupation === "office" ? 90 : occupation === "field" ? 70 : 50;
    const lifestyleScore = lifestyle;
    const totalScore =
      (ageScore + healthScore + occupationScore + lifestyleScore) / 4;

    let riskLevel = "High Risk";
    if (totalScore >= 80) riskLevel = "Low Risk";
    else if (totalScore >= 60) riskLevel = "Moderate Risk";

    setRiskResult(riskLevel);
  };

  return (
    <section className="py-16">
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

          {/* --- Premium Calculator Content --- */}
          <TabsContent value="premium">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Calculator className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">Premium Calculator</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Inputs */}
                  <div className="space-y-6">
                    {/* Age */}
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <Slider
                        value={[premiumInputs.age]}
                        min={18}
                        max={70}
                        step={1}
                        onValueChange={(value) =>
                          setPremiumInputs({ ...premiumInputs, age: value[0] })
                        }
                      />
                      <div className="flex justify-between">
                        <span className="text-sm">18</span>
                        <span className="text-sm font-medium">{premiumInputs.age} years</span>
                        <span className="text-sm">70</span>
                      </div>
                    </div>

                    {/* Coverage */}
                    <div className="space-y-2">
                      <Label>Coverage Amount</Label>
                      <Slider
                        value={[premiumInputs.coverageAmount]}
                        min={50000}
                        max={1000000}
                        step={10000}
                        onValueChange={(value) =>
                          setPremiumInputs({ ...premiumInputs, coverageAmount: value[0] })
                        }
                      />
                      <div className="flex justify-between">
                        <span className="text-sm">₹50,000</span>
                        <span className="text-sm font-medium">₹{premiumInputs.coverageAmount.toLocaleString()}</span>
                        <span className="text-sm">₹10,00,000</span>
                      </div>
                    </div>

                    {/* Term */}
                    <div className="space-y-2">
                      <Label>Term Length</Label>
                      <Slider
                        value={[premiumInputs.term]}
                        min={5}
                        max={30}
                        step={1}
                        onValueChange={(value) =>
                          setPremiumInputs({ ...premiumInputs, term: value[0] })
                        }
                      />
                      <div className="flex justify-between">
                        <span className="text-sm">5</span>
                        <span className="text-sm font-medium">{premiumInputs.term} years</span>
                        <span className="text-sm">30</span>
                      </div>
                    </div>

                    {/* Health */}
                    <div className="space-y-2">
                      <Label>Health Status</Label>
                      <Slider
                        value={[premiumInputs.healthStatus]}
                        min={50}
                        max={100}
                        step={5}
                        onValueChange={(value) =>
                          setPremiumInputs({ ...premiumInputs, healthStatus: value[0] })
                        }
                      />
                      <div className="flex justify-between">
                        <span className="text-sm">Poor</span>
                        <span className="text-sm font-medium">{premiumInputs.healthStatus}%</span>
                        <span className="text-sm">Excellent</span>
                      </div>
                    </div>

                    <Button onClick={calculatePremium}>Calculate Premium</Button>
                  </div>

                  {/* Result */}
                  <div className="flex flex-col w-full items-center justify-center p-6 bg-muted/30 rounded-lg min-h-[240px] text-center">

                    <IndianRupee className="h-12 w-12 text-primary mb-4" />
                    <h4 className="text-lg font-medium mb-2">Estimated Monthly Premium</h4>
                    {premiumResult !== null ? (
                      <div className="text-4xl font-bold text-primary">₹{premiumResult}</div>
                    ) : (
                      <p className="text-muted-foreground text-center">
                        Adjust the sliders and click Calculate to see your estimated premium
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- Maturity Benefits --- */}
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
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Annual Interest Rate (%)</Label>
                      <Slider
                        value={[maturityInputs.interestRate]}
                        min={4}
                        max={12}
                        step={0.5}
                        onValueChange={(value) =>
                          setMaturityInputs({ ...maturityInputs, interestRate: value[0] })
                        }
                      />
                      <div className="flex justify-between">
                        <span className="text-sm">4%</span>
                        <span className="text-sm font-medium">{maturityInputs.interestRate}%</span>
                        <span className="text-sm">12%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Investment Period (Years)</Label>
                      <Slider
                        value={[maturityInputs.years]}
                        min={5}
                        max={30}
                        step={1}
                        onValueChange={(value) =>
                          setMaturityInputs({ ...maturityInputs, years: value[0] })
                        }
                      />
                      <div className="flex justify-between">
                        <span className="text-sm">5</span>
                        <span className="text-sm font-medium">{maturityInputs.years} years</span>
                        <span className="text-sm">30</span>
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- Risk Analysis --- */}
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
                      <Slider
                        value={[riskInputs.age]}
                        min={18}
                        max={70}
                        step={1}
                        onValueChange={(value) =>
                          setRiskInputs({ ...riskInputs, age: value[0] })
                        }
                      />
                      <div className="flex justify-between">
                        <span className="text-sm">18</span>
                        <span className="text-sm font-medium">{riskInputs.age} years</span>
                        <span className="text-sm">70</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Health Score</Label>
                      <Slider
                        value={[riskInputs.healthScore]}
                        min={40}
                        max={100}
                        step={5}
                        onValueChange={(value) =>
                          setRiskInputs({ ...riskInputs, healthScore: value[0] })
                        }
                      />
                      <div className="flex justify-between">
                        <span className="text-sm">Poor</span>
                        <span className="text-sm font-medium">{riskInputs.healthScore}%</span>
                        <span className="text-sm">Excellent</span>
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
                      <Slider
                        value={[riskInputs.lifestyle]}
                        min={40}
                        max={100}
                        step={5}
                        onValueChange={(value) =>
                          setRiskInputs({ ...riskInputs, lifestyle: value[0] })
                        }
                      />
                      <div className="flex justify-between">
                        <span className="text-sm">Risky</span>
                        <span className="text-sm font-medium">{riskInputs.lifestyle}%</span>
                        <span className="text-sm">Healthy</span>
                      </div>
                    </div>

                    <Button onClick={calculateRisk}>Analyze Risk</Button>
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg">
                    <Shield className="h-12 w-12 text-primary mb-4" />
                    <h4 className="text-lg font-medium mb-2">Risk Assessment</h4>
                    {riskResult !== null ? (
                      <div
                        className={`text-4xl font-bold ${
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
