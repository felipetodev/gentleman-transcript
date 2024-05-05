"use client"

import * as React from "react";
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
import { placeholder } from "@/lib/utils"
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
  const [message, setMessage] = React.useState("")
  const [loadTranscript, setLoadTranscript] = React.useState(false)

  const { completion, complete, isLoading } = useCompletion({
    api: 'api/completion',
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
                ? <><Loader className="mr-2" /> Transcribing...</>
                : 'Transcript it! ✨'}
            </Button>
            <Badge className="absolute top-2 right-2">
              {message.length}
            </Badge>
          </form>
        </TabsContent>
        <TabsContent value="transcript">
          <Message
            isLoading={isLoading}
            content={completion}
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
