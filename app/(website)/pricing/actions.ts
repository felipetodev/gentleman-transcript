"use server"

import Stripe from "stripe";
import { env } from "@/env";

export async function checkoutAction(userId: string, credits: number) {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-04-10"
  })

  const url = env.URL || process.env.VERCEL_URL

  const PRICE_IDS: Record<number, string> = {
    50: env.STRIPE_PRICE_ID_50,
    100: env.STRIPE_PRICE_ID_100,
    250: env.STRIPE_PRICE_ID_250,
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: PRICE_IDS[credits],
        quantity: 1
      }
    ],
    success_url: `${url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${url}/pricing`,
    metadata: {
      userId,
      credits
    }
  })

  if (!checkoutSession.url) {
    throw new Error("Failed to create checkout session")
  }

  return { redirectUrl: checkoutSession.url }
}
