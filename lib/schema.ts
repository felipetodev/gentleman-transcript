import { z } from "zod";

export const completionSchema = z
  .string()
  .trim()
  .min(100)
