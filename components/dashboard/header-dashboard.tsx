import { Moustache } from "@/components/ui/icons";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function HeaderDashboard() {
  return (
    <header className="h-12 flex items-center justify-between px-6">
      <Link
        href="/"
        className="flex items-center text-lg text-secondary font-bold tracking-tight"
      >
        <Moustache className="size-10 mr-2" />
        Gentleman Transcript
      </Link>
      <UserButton />
    </header>
  )
}
