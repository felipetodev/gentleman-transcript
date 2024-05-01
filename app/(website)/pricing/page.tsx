import Link from 'next/link';
import { redirect } from 'next/navigation'
import Stripe from "stripe";
import { CheckIcon, Layers2Icon } from "lucide-react";
import { buttonVariants } from '@/components/ui/button';
import { SubmitButton } from './_components/submit';
import { auth } from '@clerk/nextjs/server';
import { cn } from '@/lib/utils';
import { env } from "@/env";

const FREE_FEATURES = {
  title: 'Free plan',
  price: 0,
  description: 'For hobby & casual users.',
  features: [
    'Llama 3 local AI transcriptions',
    'Basic support'
  ]
}

const PRO_FEATURES = {
  title: 'Pro plan',
  price: 10,
  description: 'Best option for content creators with a growing audience.',
  features: [
    'Unlimited AI transcriptions',
    'Storage for up to 1000 transcriptions',
    'Premium support',
    'Free updates',
  ]
};

async function getSubscriptionCheckoutUrl(userId: string) {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-04-10"
  })

  const url = env.URL || process.env.VERCEL_URL

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: env.STRIPE_SUBSCRIPTION_PRICE_ID,
        quantity: 1
      }
    ],
    success_url: `${url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${url}/pricing`,
    subscription_data: {
      metadata: {
        userId
      }
    }
  })

  if (!checkoutSession.url) {
    throw new Error("Failed to create checkout session")
  }

  return { redirectUrl: checkoutSession.url }
}

export default async function PricingPage() {
  const { userId } = auth();

  return (
    <div className="animate-fade-in-up grid gap-10 grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col p-6 w-full mx-auto max-w-md text-center text-gray-900 bg-white rounded-lg border-2 shadow border-black xl:p-8">
        <h3 className="mb-4 text-2xl font-semibold bg-black text-white w-max mx-auto rounded-full px-6 py-0.5 shadow-lg">
          {FREE_FEATURES.title} <Layers2Icon className="inline-block size-6" />
        </h3>
        <p className="text-primary/80">
          {FREE_FEATURES.description}
        </p>
        <div className="flex justify-center items-baseline my-8">
          <span className="mr-2 text-5xl font-extrabold">${FREE_FEATURES.price}</span>
        </div>
        <ul role="list" className="mb-8 space-y-4 text-left">
          {FREE_FEATURES.features.map((feature) => (
            <li key={feature} className="flex items-center text-sm space-x-3">
              <CheckIcon className="text-green-400" />
              <span className='text-primary/75'>{feature}</span>
            </li>
          ))}
        </ul>
        <Link href={userId ? "/app" : "/signin"} className={cn(buttonVariants(), 'mt-auto')}>
          Start for free
        </Link>
      </div>
      <div className="flex flex-col p-6 w-full mx-auto max-w-md text-center text-gray-900 bg-white rounded-lg border-2 shadow border-[#63e] xl:p-8">
        <h3 className="mb-4 text-2xl font-semibold bg-[#63e] text-white w-max mx-auto rounded-full px-6 py-0.5 shadow-lg">
          {PRO_FEATURES.title} <Layers2Icon className="inline-block size-6" />
        </h3>
        <p className="text-primary/80">
          {PRO_FEATURES.description}
        </p>
        <div className="flex justify-center items-baseline my-8">
          <span className="mr-2 text-5xl font-extrabold">${PRO_FEATURES.price}</span>
          <span className="text-primary/80">/month</span>
        </div>
        <ul role="list" className="mb-8 space-y-4 text-left">
          {PRO_FEATURES.features.map((feature) => (
            <li key={feature} className="flex items-center text-sm space-x-3">
              <CheckIcon className="text-green-400" />
              <span className='text-primary/75'>{feature}</span>
            </li>
          ))}
        </ul>
        <form
          className="w-full"
          action={async () => {
            "use server"

            if (!userId) {
              redirect("/signin")
            }

            const { redirectUrl } = await getSubscriptionCheckoutUrl(userId)
            redirect(redirectUrl)
          }}
        >
          <SubmitButton className="w-full" disabled>
            Get started (coming soon)
          </SubmitButton>
        </form>
      </div>
    </div>
  )
}
