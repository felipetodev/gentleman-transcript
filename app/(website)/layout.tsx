import { Header } from "@/components/header";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <section className="max-w-4xl mx-auto grid gap-y-5 mt-20">
        {children}
      </section>
    </>
  )
}
