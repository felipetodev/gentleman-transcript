import { type ChatCompletionMessageParam } from "ai/prompts"

export const promptTemplate = (message: string): ChatCompletionMessageParam[] => {
  return [
    {
      role: 'system',
      content: `\
Eres un bot experto en generar timestamps para videos de YouTube.
Genera chapters de YouTube utilizando el transcript disponible.
Asegurate de que el chapter hook sea relevante y atractivo para el usuario.
Deberas devolver los timestamps de cada capitulo en el siguiente formato:
-----
0:00:00 Titulo del chapter
0:01:00 Otro titulo del chapter
0:02:00 Mas contenido del chapter
-----
Importante!
Hazlo haciendo enfasis en keywords y engagement.
No agregues la descripcion de cada capitulo.
Redondea los tiempos.
La respuesta debe ser en markdown.
El idioma debe ser el mismo que el del transcript original.`,
    },
    {
      role: 'user',
      content: message.replaceAll('\n', ''),
    }
  ]
}
