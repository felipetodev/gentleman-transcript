"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Message } from '@/components/message'
import { placeholder } from "@/lib/utils"
import { useCompletion } from "ai/react"
import { Loader } from "./loader"
import { toast } from "sonner"
import { z } from 'zod'

export function Form() {
  const [message, setMessage] = useState<string>("")
  const { completion, complete, isLoading } = useCompletion({
    api: 'api/transcript',
    onError: () => {
      toast.error('Something went wrong, please try again later.')
    }
  });

  return (
    <>
      <Tabs defaultValue="form">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Input</TabsTrigger>
          <TabsTrigger
            value="transcript"
          >
            {isLoading ? (
              <span className="ml-2 text-purple-500">
                Generating transcript...
              </span>
            ) : "Transcript"}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="form">
          <form
            className="relative"
            onSubmit={(e) => {
              e.preventDefault()

              const inputValidation = z
                .string()
                .trim()
                .min(100)
                .safeParse(message)

              if (!inputValidation.success) {
                return toast.warning('Please enter a valid transcript')
              }

              complete(inputValidation.data, {
                body: { message: inputValidation.data }
              })
            }}
          >
            <Textarea
              name="message"
              id="message"
              value={message}
              onChange={({ target }) => setMessage(target.value)}
              className="min-h-[500px] mb-4"
              placeholder={placeholder}
            />
            <Button size="lg" className="w-full font-semibold text-lg" disabled={isLoading}>
              {isLoading
                ? <><Loader className="mr-2" /> Transcribing...</>
                : 'Transcript it! ✨'}
            </Button>
            <span className="border rounded-lg bg-primary text-secondary absolute top-2 right-2 text-xs px-3 py-1 text-center">
              {message.replaceAll('\n', '').length}
            </span>
          </form>
        </TabsContent>
        <TabsContent value="transcript">
          <Message
            isLoading={isLoading}
            content={completion}
          />
        </TabsContent>
      </Tabs >
    </>
  )
}
