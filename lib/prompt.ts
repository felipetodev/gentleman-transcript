import { type ChatCompletionMessageParam } from "ai/prompts"

export const promptTemplate = (message: string): ChatCompletionMessageParam[] => {
  return [
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
      content: message.replaceAll('\n', ''),
    }
  ]
}
