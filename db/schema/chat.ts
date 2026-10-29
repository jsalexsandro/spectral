import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"
import type { UIMessage } from "ai"
import { users } from "./auth"

export const messageRole = pgEnum("MessageRole", [
  "user",
  "assistant",
  "system",
])

export const chats = pgTable(
  "Chat",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").default("Nova conversa").notNull(),
    provider: text("provider"),
    model: text("model"),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
  },
  (chat) => ({
    userIdUpdatedAtIdx: index("Chat_userId_updatedAt_idx").on(
      chat.userId,
      chat.updatedAt,
    ),
  }),
)

export const chatMessages = pgTable(
  "Message",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    chatId: text("chatId")
      .notNull()
      .references(() => chats.id, { onDelete: "cascade" }),
    role: messageRole("role").notNull(),
    content: text("content").notNull(),
    parts: jsonb("parts").$type<UIMessage["parts"]>().notNull(),
    provider: text("provider"),
    model: text("model"),
    inputTokens: integer("inputTokens"),
    outputTokens: integer("outputTokens"),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  },
  (message) => ({
    chatIdCreatedAtIdx: index("Message_chatId_createdAt_idx").on(
      message.chatId,
      message.createdAt,
    ),
  }),
)
