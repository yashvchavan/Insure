// pages/api/verify-payment.ts
import Razorpay from "razorpay";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, policyId } = req.body;
    
    // Create the expected signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    // Verify the signature
    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Here you would typically:
    // 1. Update your database with the payment details
    // 2. Renew the policy
    // 3. Send confirmation email, etc.

    return res.status(200).json({ 
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id 
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ message: "Error verifying payment" });
  }
}