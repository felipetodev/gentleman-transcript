import { StreamingTextResponse, LangChainStream } from 'ai';
import { ChatOpenAI } from "@langchain/openai";
import { Ollama } from "@langchain/community/llms/ollama";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { completionSchema } from '@/lib/schema';
import { SUMMARY_PROMPT, SUMMARY_REFINE_PROMPT } from '@/lib/prompt';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { prompt: message } = await req.json() as { prompt: string };

  const validation = completionSchema.safeParse(message);

  if (!validation.success || !process.env.OPENAI_API_KEY) {
    throw new Error('Unauthorized');
  }

  const llmChoice = cookies().get("local-llm")
  const localLLM = llmChoice ? JSON.parse(llmChoice.value) : undefined

  const llm = localLLM
    ? new Ollama({
      baseUrl: "http://localhost:11434",
      model: "llama3"
    })
    : new ChatOpenAI({
      model: 'gpt-3.5-turbo',
      temperature: 0.2,
      streaming: true
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
    { callbacks: [handlers] }
  );

  return new StreamingTextResponse(stream);
}
