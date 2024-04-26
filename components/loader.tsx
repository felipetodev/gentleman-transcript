import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";

export function Loader({ className }: { className?: string }) {
  return (
    <LoaderIcon className={cn("animate-spin text-white", className)} />
  )
}
