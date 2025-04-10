"use client"

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RenewPolicyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const policyId = searchParams?.get("policyId") || null;
  const [paymentStatus, setPaymentStatus] = useState<"processing" | "success" | "failed" | "idle">("idle");
  const [paymentUrl, setPaymentUrl] = useState("");

  useEffect(() => {
    if (policyId) {
      // In a real app, you would call your API to create a payment session
      // and get the payment gateway URL
      setPaymentStatus("processing");
      setTimeout(() => {
        // Simulate getting payment URL
        setPaymentUrl(`https://payment-gateway.example.com/pay?policy=${policyId}`);
        setPaymentStatus("idle");
      }, 1000);
    }
  }, [policyId]);

  const handlePayment = () => {
    setPaymentStatus("processing");
    // In a real app, you would redirect to the payment gateway
    setTimeout(() => {
      // Simulate successful payment
      setPaymentStatus("success");
      console.log("Payment processed successfully!");
    }, 2000);
  };

  const handleBack = () => {
    router.back(); // Go back to previous page
  };

  if (!policyId) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid Policy</h1>
        <p className="text-muted-foreground mb-6">No policy specified for renewal</p>
        <Link href="/user-dashboard/policies">
          <Button>Back to My Policies</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 max-w-md text-gray-900 bg-white">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Renew Your Policy</h1>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Policy ID:</span>
            <span className="font-medium">{policyId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Renewal Amount:</span>
            <span className="font-medium">$120.00</span>
          </div>
        </div>

        {paymentStatus === "success" ? (
          <div className="text-center">
            <div className="text-green-500 mb-4">Payment Successful!</div>
            <Link href="/user-dashboard/policies">
              <Button>Back to My Policies</Button>
            </Link>
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={handlePayment}
            disabled={paymentStatus === "processing"}
          >
            {paymentStatus === "processing" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        )}

        {/* In a real app, you would use this for actual payment gateway */}
        {paymentUrl && (
          <div className="mt-4 p-4 bg-muted/50 rounded text-sm text-center">
            [This would redirect to: {paymentUrl}]
          </div>
        )}
      </div>
    </div>
  );
}