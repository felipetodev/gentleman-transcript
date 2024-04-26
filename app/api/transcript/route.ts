import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `\
Genera chapters de YouTube para el timeline utilizando el siguiente transcript y hazlo en el siguiente formato:
"0:00:00 titulo del chapter"
Importante!
Hazlo haciendo enfasis en keywords y engagement.
No agregues la descripcion de cada capitulo.
Redondea los tiempos.
La respuesta debe ser en markdown.\
`,
      },
      {
        role: 'user',
        content: messages[0].content.replaceAll('\n', ''),
      }
    ],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
