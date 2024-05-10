// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `test-gentleman_${name}`);

export const users = createTable(
  "users",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    userId: text("user_id").unique(),
    name: text("name"),
    email: text("email").unique(),
    imageUrl: text("image_url"),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: int("updatedAt", { mode: "timestamp" }),
    stripeCustomerId: text("stripe_customer_id"),
    credits: int("credits", { mode: "number" }).default(10).notNull(),
  },
  // (example) => ({
  //   nameIndex: index("name_idx").on(example.name),
  // })
);
