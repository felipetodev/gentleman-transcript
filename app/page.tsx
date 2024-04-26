import { Form } from "@/components/ui/form";

export default function Home() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <main className="animate-fade-in-up max-w-4xl mx-auto space-y-2">
        <div className="flex items-center justify-center space-x-4">
          <h1 className='bg-gradient-to-t from-[#c7d2fe] to-[#8678f9] font-bold bg-clip-text text-4xl text-transparent'>
            Gentleman Youtube Transcripter
          </h1>
          <span className="text-5xl">
            🫦
          </span>
        </div>
        <Form />
      </main>
    </div>
  );
}
