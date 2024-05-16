import { type NextRequest } from 'next/server';
import { StreamingTextResponse, LangChainStream } from 'ai';
import { ChatOpenAI } from "@langchain/openai";
import { Ollama } from "@langchain/community/llms/ollama";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { completionSchema } from '@/lib/schema';
import { TRANSCRIPT_PROMPT, TRANSCRIPT_REFINE_PROMPT } from '@/lib/prompt';
import { cookies } from 'next/headers';
import { getAuth } from '@clerk/nextjs/server';
import { env } from '@/env';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { prompt: message } = await req.json() as { prompt: string };
  const { userId } = getAuth(req);

  const validation = completionSchema.safeParse(message);

  if (!validation.success || !env.OPENAI_API_KEY || !userId) {
    throw new Error('Unauthorized');
  }

  const account = await db.query.users.findFirst({
    where: eq(users.userId, userId)
  })

  if (!account) {
    throw new Error('Unauthorized');
  }

  const llmChoice = cookies().get("local-llm")
  const localLLM = llmChoice ? JSON.parse(llmChoice.value) : undefined

  if (account.credits < 1 && !localLLM) {
    return new Response(
      "You have no credits left. Please purchase more credits to continue.",
      { status: 402 },
    );
  }

  const llm = localLLM
    ? new Ollama({
      baseUrl: "http://localhost:11434",
      model: "llama3"
    })
    : new ChatOpenAI({
      model: env.OPENAI_MODEL_ID,
      temperature: 0.2,
      streaming: true,
      apiKey: env.OPENAI_API_KEY,
    });

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 10000,
    chunkOverlap: 250,
  });
  const docs = await textSplitter.createDocuments([message]);

  const chain = loadSummarizationChain(llm, {
    type: "refine",
    verbose: process.env.NODE_ENV === "development",
    questionPrompt: TRANSCRIPT_PROMPT,
    refinePrompt: TRANSCRIPT_REFINE_PROMPT,
  });

  const { stream, handlers } = LangChainStream();

  if (!localLLM) {
    await db.update(users)
      .set({
        credits: sql`${users.credits} - 1`,
      })
      .where(eq(users.userId, userId))
  }

  chain.invoke(
    {
      input_documents: docs,
    },
    {
      callbacks: [handlers],
      metadata: { account },
      tags: [env.OPENAI_MODEL_ID]
    }
  ).catch(async (error) => {
    console.error("[API error occurred]", error as Error);

    // Increment their credit if something went wrong
    if (!localLLM) {
      await db.update(users)
        .set({
          credits: sql`${users.credits} + 1`,
        })
        .where(eq(users.userId, userId))
    }
  })

  return new StreamingTextResponse(stream);
}
