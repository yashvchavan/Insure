"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, CheckCircle } from "lucide-react";

interface PolicyRecommendationFormProps {
  onClose: () => void;
}

export default function PolicyRecommendationForm({ onClose }: PolicyRecommendationFormProps) {
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    bmi: "",
    gender: "",
    smoker: "",
    region: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const calculateBMI = (height: string, weight: string) => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    if (heightInMeters > 0 && weightInKg > 0) {
      return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return "";
  };

  const handleChange = (field: string, value: string) => {
    let newFormData = { ...formData, [field]: value };

    if (field === "height" || field === "weight") {
      newFormData.bmi = calculateBMI(newFormData.height, newFormData.weight);
    }

    setFormData(newFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age: parseInt(formData.age),
          bmi: parseFloat(formData.bmi),
          sex: formData.gender,
          smoker: formData.smoker,
          region: formData.region,
        }),
      });

      const data = await response.json();
      setRecommendation(data.recommended_policy);
      setSubmitted(true);
    } catch (error) {
      console.error("Error fetching recommendation:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Policy Recommendation</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {submitted ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Recommended Policy</h3>
          <p className="text-lg font-medium">{recommendation}</p>
          <Button className="mt-6" onClick={onClose}>
            Close
          </Button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input 
                id="age" 
                type="number" 
                placeholder="Enter your age" 
                value={formData.age} 
                onChange={(e) => handleChange("age", e.target.value.replace(/\D/, ""))} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" placeholder="Enter height in cm" value={formData.height} onChange={(e) => handleChange("height", e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" placeholder="Enter weight in kg" value={formData.weight} onChange={(e) => handleChange("weight", e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bmi">BMI (Auto-calculated)</Label>
              <Input id="bmi" type="number" step="0.1" placeholder="BMI will be calculated" value={formData.bmi} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup value={formData.gender} onValueChange={(value) => handleChange("gender", value)} required>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Smoker</Label>
              <RadioGroup value={formData.smoker} onValueChange={(value) => handleChange("smoker", value)} required>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Region</Label>
              <Select value={formData.region} onValueChange={(value) => handleChange("region", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="northeast">Northeast</SelectItem>
                  <SelectItem value="northwest">Northwest</SelectItem>
                  <SelectItem value="southeast">Southeast</SelectItem>
                  <SelectItem value="southwest">Southwest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end mt-6">
              <Button type="submit">Get Recommendations</Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
