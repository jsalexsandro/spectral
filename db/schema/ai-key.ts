import { index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"
import { users } from "./auth"

export const aiKeys = pgTable(
  "AIKey",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    apiKey: text("apiKey").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
  },
  (aiKey) => ({
    userProviderUnique: uniqueIndex("AIKey_userId_provider_key").on(
      aiKey.userId,
      aiKey.provider,
    ),
    userIdIdx: index("AIKey_userId_idx").on(aiKey.userId),
  }),
)
