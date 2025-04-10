"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, FileText, Calendar, DollarSign, Shield, Loader2 } from "lucide-react";
import useAuth from "@/context/store";

interface Application {
  _id: string;
  applicationId: string;
  policyId: string;
  startDate: string;
  status: "pending" | "approved" | "rejected";
  policyName?: string;
  premiumAmount?: string;
  rejectionReason?: string;
}

export default function PolicyOverview() {
  const [isOpen, setIsOpen] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth() as { user: { id: string } | null } || { user: null };
  const router = useRouter();

  const fetchApplications = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/user-applications?userId=${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setApplications(data.applications);
      } else {
        throw new Error(data.error || "Failed to fetch applications");
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleIconClick = async () => {
    if (!user) {
      router.push("/user-login");
    } else {
      if (!isOpen) {
        await fetchApplications();
      }
      setIsOpen((prev) => !prev);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchApplications();
    }
  }, [isOpen, user?.id]);

  return (
    <>
      <motion.button
        className="h-12 w-12 rounded-full bg-primary/80 text-primary-foreground flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleIconClick}
      >
        <FileText className="h-6 w-6" />
      </motion.button>

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
                <h3 className="font-medium">My Applications</h3>
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
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : applications.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">
                    No applications found
                  </p>
                ) : (
                  applications.map((app) => (
                    <Card key={app._id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-3 border-l-4 border-primary">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">
                              {app.policyName || `Policy ${app.policyId.slice(0, 6)}`}
                            </h4>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(app.status)}`}>
                              {app.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              Applied: {new Date(app.startDate).toLocaleDateString()}
                            </div>
                            {app.premiumAmount && (
                              <div className="flex items-center text-muted-foreground">
                                <DollarSign className="h-3 w-3 mr-1" />
                                {app.premiumAmount}
                              </div>
                            )}
                            {app.status === "rejected" && app.rejectionReason && (
                              <div className="col-span-2 text-xs text-red-500">
                                Reason: {app.rejectionReason}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push("/user-dashboard/applications")}
                >
                  View All Applications
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}