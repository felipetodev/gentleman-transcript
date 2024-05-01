import { Moustache } from "@/components/ui/icons";

interface CheckoutPageParams {
  params: Array<'success' | string>
  searchParams: {
    session_id: string
    payment_intent: string
  };
}

export default function CheckoutPage({ params, searchParams }: CheckoutPageParams) {
  return (
    <div className="grid place-items-center h-full text-white text-4xl">
      <Moustache className="size-28" />
      <h1>
        Thanks you for your purchase!
      </h1>
      <span className="text-xs mt-10">
        {searchParams.session_id}
      </span>
    </div>
  )
}
