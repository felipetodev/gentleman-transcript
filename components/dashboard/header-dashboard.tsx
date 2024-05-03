import { Moustache } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function HeaderDashboard({ status }: { status?: string | null }) {
  return (
    <header className="h-12 flex items-center justify-between px-6">
      <div className="flex items-center space-x-2">
        <Link
          href="/"
          className="flex items-center text-lg text-secondary font-bold tracking-tight"
        >
          <Moustache className="size-10 mr-2" />
          Gentleman Transcript
        </Link>
        {status === "ACTIVE" && <Badge variant="gentleman">PRO</Badge>}
        {status === "INACTIVE" && <Badge variant="secondary">Free</Badge>}
        {status === "CANCELLED" && <Badge variant="secondary">Free</Badge>}
      </div>
      <UserButton />
    </header>
  )
}
