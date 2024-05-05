import { Moustache } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

type Props = {
  user?: boolean,
  hasPayment?: boolean,
  credits?: number | null
}

export function HeaderDashboard({ user = false, credits = 0, hasPayment }: Props) {
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
        {user && (
          <>
            {hasPayment && credits && credits > 0 && (
              <Badge variant="gentleman">PRO</Badge>
            )}
            {!hasPayment && credits && (
              <Badge variant="secondary">Free</Badge>
            )}
          </>
        )}
      </div>
      <div className="flex items-center space-x-2 text-[10px] text-secondary opacity-80">
        {user && (
          <>
            {credits && credits > 0 ? (
              <span>
                {credits} Credit{credits > 1 ? "s" : ""}
              </span>
            ) : (
              <span>
                No credits left
              </span>
            )}
          </>
        )}
        <UserButton />
      </div>
    </header>
  )
}
