import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import { GitIc } from "@/components/ui/icons";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gentleman Transcripter",
  description: "Transcript your YouTube videos easily and quickly with Gentleman Transcripter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <p className="absolute top-4 right-8">
          <a
            href="https://github.com/felipetodev/gentleman-transcript"
            aria-label="View app repository on GitHub"
            rel="noreferrer"
            target="_blank"
            className="flex items-center gap-2 text-secondary"
          >
            <GitIc className="size-5 " />
            GitHub
          </a>
        </p>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
