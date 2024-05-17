"use client"

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge";
import { Message } from '@/components/dashboard/message'
import { TranscriptGenerator } from "@/components/dashboard/transcript-generator";
import { Loader } from "@/components/loader"
import { MAX_TRANSCRIPT_LENGTH, cn, placeholder } from "@/lib/utils"
import { useCompletion } from "ai/react"
import { completionSchema } from "@/lib/schema"
import { toast } from "sonner"

type FormContextProps = {
  isLoadingTranscript: boolean;
  onLoadingTranscript: (boolean: boolean) => void;
  onSetMessage: (message: string) => void;
};

export const TranscriptFormContext = React.createContext<FormContextProps | null>(null);

function useTranscriptForm() {
  const context = React.useContext(TranscriptFormContext);

  if (!context) {
    throw new Error("useTranscriptForm must be used within a <TranscriptForm />");
  }

  return context;
}

const TranscriptForm = () => {
  const router = useRouter()
  const [message, setMessage] = React.useState("")
  const [loadTranscript, setLoadTranscript] = React.useState(false)

  const { completion, complete, isLoading } = useCompletion({
    api: 'api/completion',
    onFinish: () => {
      router.refresh()
    },
    onError: (error) => {
      if (error.message.includes("You have no credits left")) {
        toast.warning(error.message)
      } else {
        toast.error(
          "An internal server error occurred. Please contact our support if the problem persists."
        )
      }
    }
  });

  const onLoadingTranscript = (value: boolean) => {
    setLoadTranscript(value)
  }

  const onSetMessage = (message: string) => {
    setMessage(message)
  }

  const hasLimitLength = message.length > MAX_TRANSCRIPT_LENGTH

  return (
    <TranscriptFormContext.Provider
      value={{
        isLoadingTranscript: loadTranscript,
        onLoadingTranscript,
        onSetMessage
      }}
    >
      <Tabs defaultValue="form">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Input</TabsTrigger>
          <TabsTrigger
            value="transcript"
          >
            {isLoading ? (
              <span className="ml-2 text-purple-500">
                Generating chapters...
              </span>
            ) : "Chapters / Timestamps"}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="form">
          <TranscriptGenerator />
          <form
            className="relative"
            onSubmit={(e) => {
              e.preventDefault()

              const inputValidation = completionSchema.safeParse(message)

              if (!inputValidation.success) {
                return toast.warning('Please enter a valid transcript')
              }

              if (hasLimitLength) {
                return toast.error(
                  `Transcript is too long. Please enter a transcript with less than ${MAX_TRANSCRIPT_LENGTH} characters.`
                )
              }

              complete(inputValidation.data)
            }}
          >
            <Textarea
              name="message"
              id="message"
              value={message}
              onChange={({ target }) => setMessage(target.value)}
              className="min-h-[500px] mb-4"
              placeholder={loadTranscript ? "Getting transcript from the YouTube video..." : placeholder}
            />
            <Button size="lg" className="w-full font-semibold text-lg" disabled={isLoading}>
              {isLoading
                ? <><Loader className="mr-2" /> Generating Chapters...</>
                : 'Generate Chapters'}
            </Button>
            <Badge
              className={cn("absolute top-2 right-2", {
                "bg-red-600 hover:bg-red-600/80": hasLimitLength
              })}
            >
              {new Intl.NumberFormat("es").format(MAX_TRANSCRIPT_LENGTH)} / {new Intl.NumberFormat("es").format(message.length)}
            </Badge>
          </form>
        </TabsContent>
        <TabsContent value="transcript">
          <Message
            isLoading={isLoading}
            content={completion}
            onClick={() => {
              if (hasLimitLength) {
                return toast.error(
                  `Transcript is too long. Please enter a transcript with less than ${MAX_TRANSCRIPT_LENGTH} characters.`
                )
              }
              complete(message)
            }}
          />
        </TabsContent>
      </Tabs >
    </TranscriptFormContext.Provider>
  )
}

TranscriptForm.displayName = "TranscriptForm"

export {
  useTranscriptForm,
  TranscriptForm
}
