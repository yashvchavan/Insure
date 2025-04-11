// pages/api/create-razorpay-order.ts
import Razorpay from "razorpay";
import { NextApiRequest, NextApiResponse } from "next";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { amount, policyId, currency } = req.body;

    const options = {
      amount: amount, // amount in smallest currency unit (paise for INR)
      currency: currency || "INR",
      receipt: `policy_renewal_${policyId}`,
      payment_capture: 1, // auto capture payment
      notes: {
        policyId: policyId
      }
    };

    const order = await razorpay.orders.create(options);
    
    return res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res.status(500).json({ message: "Error creating order" });
  }
}