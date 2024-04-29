"use client";

import Link from "next/link";
import { Moustache } from "./ui/icons";
import { cn } from "@/lib/utils";

const links = [
  {
    title: "Pricing",
    path: "/pricing",
    name: "pricing",
  },
  {
    title: "Updates",
    path: "/updates",
    name: "updates",
  },
  {
    title: "GitHub",
    path: "https://github.com/felipetodev/gentleman-transcript",
    name: "GitHub",
  },
];

export function Header() {
  return (
    <header className="h-12 sticky mt-4 top-4 z-50 px-2 md:px-4 md:flex justify-center">
      <nav className="border border-[#63e] p-3 rounded-2xl flex items-center backdrop-filter backdrop-blur-xl bg-[#121212] bg-opacity-70">
        <Link href="/">
          <span className="sr-only">
            Gentleman Transcript Logo
          </span>
          <Moustache className="size-10 text-white" />
        </Link>

        <ul className="space-x-2 font-medium text-sm hidden md:flex mx-3">
          {links.map(({ path, title }) => (
            <li key={path}>
              <Link
                href={path}
                {...path.includes("https://") ? {
                  rel: "noopener noreferrer",
                  target: "_blank"
                } : {}}
                className={cn(
                  "h-8 items-center !text-white justify-center rounded-md text-sm font-medium transition-colors px-3 py-2 inline-flex text-secondary-foreground hover:bg-[#63e] hover:text-white",
                  // isActive && "bg-secondary hover:bg-secondary"
                )}
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/app"
          className="hidden md:inline-flex h-8 items-center justify-center rounded-md text-sm font-medium transition-colors px-3 py-2 text-primary-foreground bg-[#63e] hover:bg-[#63e]/90"
        >
          Sign in
        </Link>
      </nav>
    </header>
  );
}
