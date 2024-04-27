import OpenAI from 'openai';
import {
  OpenAIStream,
  StreamingTextResponse
} from 'ai';
import { promptTemplate } from '@/lib/prompt';
import { completionSchema } from '@/lib/schema';
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const ollama = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
});

export async function POST(req: Request) {
  const { prompt: message } = await req.json() as { prompt: string };

  const validation = completionSchema.safeParse(message);

  if (!validation.success) {
    throw new Error('Unauthorized');
  }

  const llmChoice = cookies().get("local-llm")
  const localLLM = llmChoice ? JSON.parse(llmChoice.value) : undefined

  const response = localLLM
    ? await ollama.chat.completions.create({
      model: 'llama3',
      stream: true,
      messages: promptTemplate(message),
    })
    : await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      stream: true,
      messages: promptTemplate(message),
    });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
