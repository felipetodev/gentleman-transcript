import { env } from "@/env";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import Stripe from "stripe";


export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return new Response("Error occured", {
      status: 400,
    });
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-04-10"
  })

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    webhookSecret
  )

  switch (event.type) {
    // event.type === "payment_intent.succeeded"
    // event.type === "checkout.session.completed"
    case "checkout.session.completed": {
      const payment = event.data.object as Stripe.Checkout.Session

      const { userId, credits } = payment.metadata!

      if (payment.mode === "payment") {
        await db.update(users)
          .set({
            credits: sql`${users.credits} + ${credits}`,
            stripeCustomerId: payment.id // id of last payment (not unique)
          })
          .where(eq(users.userId, userId))
      }

      break;
    }
  }

  return new Response("Success", { status: 200 });
}
