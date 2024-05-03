import Link from "next/link";
import { Header } from "@/components/header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SparklesIcon } from "lucide-react";

export default function App() {
  return (
    <>
      <div className="animate-fade-in-up flex flex-col justify-center items-center gap-y-4 text-white">
        <span className='relative inline-block overflow-hidden rounded-full p-0.5'>
          <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
          <div className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950 px-3 py-2 text-xs font-medium text-purple-200 backdrop-blur-3xl'>
            AI Powered Transcription <SparklesIcon className='ml-1 size-4 text-purple-300' />
          </div>
        </span>
        <h1 className="text-6xl font-semibold text-center my-4">
          Gentleman Transcript
        </h1>
        <h2 className="text-3xl text-center opacity-80">
          Get your YouTube videos transcribed in one click.
        </h2>
        <span className="text-base text-center max-w-xl opacity-70 text-pretty">
          The best way to reach a broader audience is by providing subtitles and transcripts for your videos. Gentleman Transcript makes it easy to get your videos transcribed in just a one click.
        </span>
      </div>
      <div className="mx-auto mt-14 animate-fade-in-up duration-700">
        <Link href='/app' className={cn(buttonVariants({ variant: 'secondary' }))}>
          Get Started
        </Link>
      </div>
      <div className="animate-fade-in-up duration-700 mt-10 mb-20 p-2 rounded-[23px] lg:rounded-[29px] border-2 border-[#63e]/80 bg-gray-900/5 [box-shadow:_0px_0px_3px_1px_rgba(112,_116,_123,_0.05)]">
        <video
          loop
          muted
          autoPlay
          className="size-full object-cover rounded-[18px] overflow-clip"
          src="/landing-example.mov"
        />
      </div>
    </>
  )
}
