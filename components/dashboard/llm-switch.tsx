/* eslint-disable @next/next/no-img-element */
"use client"

import { Switch } from "@/components/ui/switch"
import { OpenAI } from "../ui/icons"

export function LLMSwitch({ llm }: { llm?: boolean }) {

  return (
    <div className="flex items-center justify-center gap-3">
      <OpenAI className="size-7" />
      <Switch
        id="llm-model"
        defaultChecked={Boolean(llm)}
        onCheckedChange={(active) => {
          document.cookie = `local-llm=${JSON.stringify(
            active
          )}`
        }}
        className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-[#51da4b]"
      />
      <div className="flex overflow-hidden rounded-full border">
        <img
          src="/ollama.png"
          alt="ollama"
          className="size-7 p-0.5 bg-white object-cover"
        />
      </div>
    </div>
  )
}
