"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default function RenewPolicyClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const policyId = searchParams?.get("policyId") || null;
  const [paymentStatus, setPaymentStatus] = useState<"processing" | "success" | "failed" | "idle">("idle");
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState(12000); // in paise (12000 = ₹120.00)

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // Create order and get payment details from your backend
  const createOrder = async () => {
    try {
      setPaymentStatus("processing");
      const response = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          policyId: policyId,
          currency: "INR"
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create order");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      setPaymentStatus("failed");
      throw error;
    }
  };

  const handlePayment = async () => {
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }
      const orderData = await createOrder();
      setOrderId(orderData.id);
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount.toString(),
        currency: orderData.currency,
        name: "Your Insurance Company",
        description: `Policy Renewal for ${policyId}`,
        image: "/logo.png",
        order_id: orderData.id,
        handler: async function(response: any) {
          setPaymentStatus("processing");
          const verificationResponse = await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              policyId: policyId
            }),
          });
          if (verificationResponse.ok) {
            setPaymentStatus("success");
          } else {
            setPaymentStatus("failed");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999"
        },
        notes: {
          policy_id: policyId
        },
        theme: {
          color: "#3399cc"
        }
      };
      // @ts-ignore - Razorpay type not included
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setPaymentStatus("failed");
    }
  };

  const handleBack = () => {
    router.back();
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
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        strategy="lazyOnload"
      />
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
            <span className="font-medium">₹{(amount / 100).toFixed(2)}</span>
          </div>
        </div>
        {paymentStatus === "success" ? (
          <div className="text-center">
            <div className="text-green-500 mb-4">Payment Successful!</div>
            <Link href="/user-dashboard/policies">
              <Button>Back to My Policies</Button>
            </Link>
          </div>
        ) : paymentStatus === "failed" ? (
          <div className="text-center">
            <div className="text-red-500 mb-4">Payment Failed. Please try again.</div>
            <Button onClick={handlePayment}>Retry Payment</Button>
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
              <>Pay ₹{(amount / 100).toFixed(2)}</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
} 