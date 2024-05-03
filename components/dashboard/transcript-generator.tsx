"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/loader"
import { CheckCheckIcon } from "lucide-react"
import { useTranscriptForm } from "./form"
import { toast } from "sonner"

export function TranscriptGenerator() {
  const inputRef = useRef<HTMLInputElement>(null)
  const successTranscriptRef = useRef<boolean>(false)

  const {
    isLoadingTranscript,
    onSetMessage,
    onLoadingTranscript
  } = useTranscriptForm()

  return (
    <div className="flex w-full items-center space-x-2 mb-2">
      <div className="relative w-full">
        <Input
          ref={inputRef}
          type="text"
          placeholder="https://www.youtube.com/watch?v=fPLGOVHJowE"
          className={successTranscriptRef.current ? 'border-green-400' : ''}
        />
        {successTranscriptRef.current && (
          <span className="absolute top-2 right-2 text-green-400">
            <CheckCheckIcon />
          </span>
        )}
      </div>
      <Button
        variant="secondary"
        disabled={isLoadingTranscript}
        onClick={async () => {
          if (!inputRef.current?.value) {
            return toast.warning('Please enter a valid YouTube url to get the transcript')
          }
          onLoadingTranscript(true)
          await fetch('/api/transcript', {
            method: 'POST',
            body: JSON.stringify({
              url: inputRef.current?.value
            })
          }).then(async (res) => {
            if (res.ok) {
              const { parsedTranscript, metadata } = await res.json()
              successTranscriptRef.current = true
              onSetMessage(parsedTranscript)
              toast.success(
                <div className="mx-auto grid text-center gap-1">
                  <span className="font-semibold">Transcript video generated successfully!</span>
                  <span>{metadata.title}</span>
                </div>
              )
            } else {
              const { error } = await res.json()
              toast.error(error)
              successTranscriptRef.current = false
            }
          })
          onLoadingTranscript(false)
        }}
      >
        {isLoadingTranscript && <Loader className="mr-2 text-primary" />}
        {isLoadingTranscript ? "Generating transcript..." : "Get Transcribe from YouTube URL"}
      </Button>
    </div>
  )
}
