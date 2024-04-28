"use client"

import * as React from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function Providers({ children }: ThemeProviderProps) {
  return (
    <ClerkProvider >
      {children}
    </ClerkProvider>
  )
}
