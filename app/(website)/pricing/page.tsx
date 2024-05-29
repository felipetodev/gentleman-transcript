import Link from 'next/link';
import { redirect } from 'next/navigation'
import { CircleCheckIcon } from "lucide-react";
import { buttonVariants } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { checkoutAction } from './actions';
import { SubmitButton } from './_components/submit';
import { auth } from '@clerk/nextjs/server';
import { cn } from '@/lib/utils';

const FREE_FEATURES = {
  title: 'Free plan',
  price: 0,
  description: 'For hobby & casual users.',
  features: [
    '10 free credits for new users',
    'Basic support'
  ]
}

const CREDITS = {
  title: 'Full access',
  description: 'Best option for content creators with a growing audience.',
  features: [
    'Unlimited AI transcriptions',
    'Storage for up to 1000 transcriptions',
    'Premium support',
    'Free updates',
  ]
};

export default async function PricingPage() {
  const { userId } = auth();

  return (
    <>
      <div className="animate-fade-in-up grid gap-10 grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col p-6 w-full mx-auto max-w-md text-gray-900 bg-white rounded-2xl border-2 shadow border-black xl:p-8">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 rounded-full bg-black" />
            <h3 className="font-display text-2xl font-bold text-black">
              {FREE_FEATURES.title}
            </h3>
          </div>
          <p className="text-primary/80">
            {FREE_FEATURES.description}
          </p>
          <div className="flex items-baseline my-8">
            <span className="mr-2 text-5xl font-extrabold">${FREE_FEATURES.price}</span>
          </div>
          <ul role="list" className="mb-8 space-y-4 text-left">
            {FREE_FEATURES.features.map((feature) => (
              <li key={feature} className="flex items-center text-sm space-x-3">
                <CircleCheckIcon />
                <span className='text-primary/75'>{feature}</span>
              </li>
            ))}
          </ul>
          <Link href={userId ? "/app" : "/signin"} className={cn(buttonVariants(), 'mt-auto')}>
            Start for free
          </Link>
        </div>
        <div className="relative flex flex-col p-6 w-full mx-auto max-w-md text-center text-gray-900 bg-white rounded-2xl border-2 shadow border-[#63e] xl:p-8">
          <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-[#63e] to-purple-600 px-3 py-2 text-center text-sm font-medium text-white">
            Credits
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-5 w-5 rounded-full bg-gradient-to-r from-[#63e] to-purple-600" />
            <h3 className="font-display text-2xl font-bold text-black">
              {CREDITS.title}
            </h3>
          </div>
          <Tabs defaultValue="pro" className="w-full">
            <TabsList className="grid w-full grid-cols-3 font-bold border">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="pro">Pro</TabsTrigger>
              <TabsTrigger value="goat">GOAT</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              <p className="text-primary/80 mt-2">
                {CREDITS.description}
              </p>
              <div className="flex justify-center items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold">$5</span>
                <span className="text-primary/80 text-purple-500">/ 50 credits</span>
              </div>
            </TabsContent>
            <TabsContent value="pro">
              <p className="text-primary/80 mt-2">
                {CREDITS.description}
              </p>
              <div className="flex justify-center items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold">$9</span>
                <span className="text-primary/80 text-purple-500">/ 100 credits</span>
              </div>
            </TabsContent>
            <TabsContent value="goat">
              <p className="text-primary/80 mt-2">
                {CREDITS.description}
              </p>
              <div className="flex justify-center items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold">$15</span>
                <span className="text-primary/80 text-purple-500">/ 250 credits</span>
              </div>
            </TabsContent>
          </Tabs>
          <ul role="list" className="mb-8 space-y-4 text-left">
            {CREDITS.features.map((feature) => (
              <li key={feature} className="flex items-center text-sm space-x-3">
                <CircleCheckIcon className="text-purple-500" />
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

              const { redirectUrl } = await checkoutAction(userId, 50)
              redirect(redirectUrl)
            }}
          >
            <SubmitButton className="w-full" disabled>
              Get started (coming soon)
            </SubmitButton>
          </form>
        </div>
      </div>
      <small className='text-xs text-white/50'>
        *Credits are used to get AI chapters transcriptions. 1 credit = 1 chapters result (whole video). Unused credits do not expire.
      </small>
    </>
  )
}
