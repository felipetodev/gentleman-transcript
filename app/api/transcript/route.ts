import OpenAI from 'openai';
import {
  OpenAIStream,
  StreamingTextResponse,
  type Message as VercelChatMessage
} from 'ai';
import { promptTemplate } from '@/lib/prompt';
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
  const { messages } = await req.json() as { messages: VercelChatMessage[] };
  const currentMessage = messages[messages.length - 1].content;
  const llmChoice = cookies().get("local-llm")
  const localLLM = llmChoice ? JSON.parse(llmChoice.value) : undefined

  const response = localLLM
    ? await ollama.chat.completions.create({
      model: 'llama3',
      stream: true,
      messages: promptTemplate(currentMessage),
    })
    : await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      stream: true,
      messages: promptTemplate(currentMessage),
    });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
