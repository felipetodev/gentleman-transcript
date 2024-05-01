import { type NextRequest } from 'next/server';
import { StreamingTextResponse, LangChainStream } from 'ai';
import { ChatOpenAI } from "@langchain/openai";
import { Ollama } from "@langchain/community/llms/ollama";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { completionSchema } from '@/lib/schema';
import { SUMMARY_PROMPT, SUMMARY_REFINE_PROMPT } from '@/lib/prompt';
import { cookies } from 'next/headers';
import { getAuth } from '@clerk/nextjs/server';
import { env } from '@/env';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

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

  const llmChoice = cookies().get("local-llm")
  const localLLM = llmChoice ? JSON.parse(llmChoice.value) : undefined

  if (account?.status !== "ACTIVE" && !localLLM) {
    return new Response(
      "Upgrade to Pro to get access to this feature.",
      { status: 402 },
    );
  }

  const llm = localLLM
    ? new Ollama({
      baseUrl: "http://localhost:11434",
      model: "llama3"
    })
    : new ChatOpenAI({
      model: 'gpt-3.5-turbo',
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
    verbose: true,
    questionPrompt: SUMMARY_PROMPT,
    refinePrompt: SUMMARY_REFINE_PROMPT,
  });

  const { stream, handlers } = LangChainStream();

  chain.invoke(
    {
      input_documents: docs,
    },
    { callbacks: [handlers], metadata: { account } }
  );

  return new StreamingTextResponse(stream);
}
