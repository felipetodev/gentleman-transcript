import { HeaderDashboard } from "@/components/dashboard/header-dashboard";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth()

  const account = await db.query.users.findFirst({
    where: eq(users.userId, userId!)
  })

  return (
    <>
      <HeaderDashboard status={account?.status} />
      <main className="animate-fade-in-up flex flex-col justify-center mx-auto h-[calc(100%-48px)] max-w-4xl gap-y-3">
        {children}
      </main>
    </>
  )
}
