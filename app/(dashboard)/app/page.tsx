import { LLMSwitch } from "@/components/dashboard/llm-switch";
import { TranscriptForm } from "@/components/dashboard/form";
import { cookies } from "next/headers";

export default function TranscriptPage() {
  const llm = cookies().get("local-llm")
  const defaultLLM = llm ? JSON.parse(llm.value) : undefined
  return (
    <>
      <LLMSwitch llm={defaultLLM} />
      <TranscriptForm />
    </>
  );
}
