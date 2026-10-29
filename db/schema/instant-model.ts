import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"
import { users } from "./auth"

export const instantModels = pgTable(
  "InstantModel",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    modelId: text("modelId").notNull(),
    enabled: boolean("enabled").default(true).notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
  },
  (instantModel) => ({
    userProviderModelUnique: uniqueIndex(
      "InstantModel_userId_provider_modelId_key",
    ).on(instantModel.userId, instantModel.provider, instantModel.modelId),
    userIdIdx: index("InstantModel_userId_idx").on(instantModel.userId),
  }),
)
