"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, FileText, Calendar, DollarSign, Shield } from "lucide-react";
import useAuth from "@/context/store";

export default function PolicyOverview() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth() as { user: { username: string } | null } || { user: null };
  const router = useRouter();

  const handleIconClick = () => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push("/user-login");
    } else {
      // Toggle the policy overview if authenticated
      setIsOpen((prev) => !prev);
    }
  };

  const policies = [
    {
      id: 1,
      name: "Health Gold Plan",
      type: "Health",
      premium: "$120/month",
      renewalDate: "Jul 15, 2023",
      status: "Active",
    },
    {
      id: 2,
      name: "Vehicle Comprehensive",
      type: "Vehicle",
      premium: "$80/month",
      renewalDate: "Aug 22, 2023",
      status: "Active",
    },
    {
      id: 3,
      name: "Term Life Insurance",
      type: "Life",
      premium: "$150/month",
      renewalDate: "Sep 10, 2023",
      status: "Active",
    },
  ];

  return (
    <>
      {/* Icon button */}
      <motion.button
        className="h-12 w-12 rounded-full bg-primary/80 text-primary-foreground flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleIconClick} // Handle click based on authentication
      >
        <FileText className="h-6 w-6" />
      </motion.button>

      {/* Policy overview (only shown if logged in) */}
      {user && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed bottom-20 left-4 w-[350px] bg-card rounded-xl shadow-xl border overflow-hidden z-50"
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
            >
              <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
                <h3 className="font-medium">My Policies</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-primary/90"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
                {policies.map((policy) => (
                  <Card key={policy.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-3 border-l-4 border-primary">
                        <h4 className="font-medium">{policy.name}</h4>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Shield className="h-3 w-3 mr-1" />
                            {policy.type}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {policy.premium}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            Renewal: {policy.renewalDate}
                          </div>
                          <div className="flex items-center">
                            <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                              {policy.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button variant="outline" className="w-full">
                  View All Policies
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}