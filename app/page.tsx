import { Header } from "@/components/header";
import { LLMSwitch } from "@/components/llm-switch";
import { Form } from "@/components/ui/form";
import { cookies } from "next/headers";

export default function Home() {
  const llm = cookies().get("local-llm")
  const defaultLLM = llm ? JSON.parse(llm.value) : undefined
  return (
    <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] overflow-y-auto">
      <main className="animate-fade-in-up max-w-4xl mx-auto space-y-2">
        <Header />
        <LLMSwitch llm={defaultLLM} />
        <Form />
      </main>
    </div>
  );
}
