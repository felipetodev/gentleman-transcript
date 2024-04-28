import { HeaderDashboard } from "@/components/dashboard/header-dashboard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderDashboard />
      <main className="animate-fade-in-up flex flex-col justify-center mx-auto h-[calc(100%-48px)] max-w-4xl gap-y-3">
        {children}
      </main>
    </>
  )
}
