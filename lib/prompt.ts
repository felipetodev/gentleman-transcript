import dedent from "dedent";
import { PromptTemplate } from "@langchain/core/prompts";

const transcriptTemplate = dedent(`
  You are a helpful expert transcript bot that generates chapters with timestamps to help users find the most interesting and important moments in a YouTube video.

  Below you find a raw transcript of a YouTube video:
  --------
  {text}
  --------
  From the transcript above, please provide the most important chapters with timestamps.
  The language must be the same as the original transcript.
  Ensure that the title (hook) of each chapter is relevant and engaging to the user and accurately represents the content of the chapter.
  Ensure that the first chapter commences precisely at timestamp 00:00:00 and concludes at the final timestamp of the transcription.
  Your response only needs to include the timestamps and titles in the following format below:

  ##### START FORMAT EXAMPLE #####
  00:00:00 Introducción a Go, resaltando su importancia y velocidad.
  00:04:09 Ventajas de Go, enfocándose en su rápida compilación y ejecución.
  00:05:50 Escalabilidad y programación concurrente en Go.
  00:06:36 Gestión automática de la memoria y recolector de basura en Go.
  00:08:00 Simplificación del desarrollo en Go, con menos boilerplate necesario.
  00:08:44 Introducción a Golan Puro y sus fundamentos.
  00:08:53 Estructura del Código y uso de Boilerplate.
  00:09:16 API Interna, Networking y velocidad de ejecución.
  00:10:01 Integración con HTMX y beneficios de renderizar desde Go.
  00:11:12 Organización del proyecto y significado de las carpetas CMD, Internal y UI.
  ##### END FORMAT EXAMPLE #####

  Important! Return your response in bullet points.

  CHAPTERS AND TIMESTAMPS:`);

const transcriptRefineTemplate = dedent(`\
  You are a helpful expert transcript bot that generates chapters with timestamps to help users find the most interesting and important moments in a YouTube video.

  We have provided an existing set of chapters with timestamps based on the original transcript: "{existing_answer}".
  We have the opportunity to continue giving more chapters based on the new context provided below.
  --------
  {text}
  --------
  Given the new context above, please refine the existing answer or provide a new one.
  Make sure to maintain the timestamps in the format provided below:
  ##### START FORMAT EXAMPLE #####
  00:00:00 Introducción a Go, resaltando su importancia y velocidad.
  00:04:09 Ventajas de Go, enfocándose en su rápida compilación y ejecución.
  00:05:50 Escalabilidad y programación concurrente en Go.
  00:06:36 Gestión automática de la memoria y recolector de basura en Go.
  00:08:00 Simplificación del desarrollo en Go, con menos boilerplate necesario.
  00:08:44 Introducción a Golan Puro y sus fundamentos.
  00:08:53 Estructura del Código y uso de Boilerplate.
  00:09:16 API Interna, Networking y velocidad de ejecución.
  00:10:01 Integración con HTMX y beneficios de renderizar desde Go.
  00:11:12 Organización del proyecto y significado de las carpetas CMD, Internal y UI.
  ##### END FORMAT EXAMPLE #####

  Important!
  Emphasize keywords and engagement.
  Do not provide timestamps that are earlier than the existing ones.
  Do not add the description of each chapter, only the timestamp and the title in the requested format.
  Please do not repeat existing chapters or timestamps from: "{existing_answer}"
  Round the times.
  The language must be the same as the original transcript.
  Give me only the most important ones.
  Return your response in bullet points.

  NEW CHAPTERS AND TIMESTAMPS:`);

export const TRANSCRIPT_PROMPT = PromptTemplate.fromTemplate(
  transcriptTemplate
);

export const TRANSCRIPT_REFINE_PROMPT = PromptTemplate.fromTemplate(
  transcriptRefineTemplate
);
