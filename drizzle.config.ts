import type { Config } from "drizzle-kit";
import { env } from "@/env";

export default {
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  driver: "turso",
  dbCredentials: {
    url: env.TURSO_DATABASE_URL as string,
    authToken: env.TURSO_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
  tablesFilter: ["test-gentleman_*"],
} satisfies Config;
