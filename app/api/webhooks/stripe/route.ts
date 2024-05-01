import { env } from "@/env";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
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
    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription

      await db.update(users)
        .set({
          status: "ACTIVE",
          package: "MONTHLY_SUBSCRIPTION",
          stripeCustomerId: subscription.customer as string,
        })
        .where(eq(users.userId, subscription.metadata.userId))

      break;
    }
    case "checkout.session.completed": {
      const payment = event.data.object as Stripe.Checkout.Session

      if (payment.mode === "payment") {
        await db.update(users)
          .set({
            status: "ACTIVE",
            package: "LIFETIME",
            stripeCustomerId: payment.customer as string,
          })
          .where(eq(users.userId, payment.metadata!.userId))
      }

      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription

      if (subscription.cancel_at_period_end) {
        await db.update(users)
          .set({
            status: "CANCELLED"
          })
          .where(eq(users.userId, subscription.metadata.userId))
      } else {
        await db.update(users)
          .set({
            status: "ACTIVE"
          })
          .where(eq(users.userId, subscription.metadata.userId))
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription

      await db.update(users)
        .set({
          status: "INACTIVE",
          package: null,
          stripeCustomerId: null,
        })
        .where(eq(users.userId, subscription.metadata.userId))
      break;
    }
  }

  return new Response("Success", { status: 200 });
}
