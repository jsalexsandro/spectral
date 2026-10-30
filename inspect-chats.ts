import { desc, eq } from "drizzle-orm"
import { db } from "./db"
import { chatMessages, chats } from "./db/schema"

async function main() {
  const rows = await db
    .select({ id: chats.id, title: chats.title, updated: chats.updatedAt })
    .from(chats)
    .orderBy(desc(chats.updatedAt))
    .limit(5)

  console.log("CHATS:")

  for (const c of rows) {
    const msgs = await db
      .select({
        id: chatMessages.id,
        role: chatMessages.role,
        created: chatMessages.createdAt,
        content: chatMessages.content,
      })
      .from(chatMessages)
      .where(eq(chatMessages.chatId, c.id))
      .orderBy(chatMessages.createdAt)

    console.log(`\n - "${c.title.slice(0, 40)}" [${c.id}]`)
    for (const m of msgs) {
      console.log(
        `    ${m.role.padEnd(9)} len=${String(m.content.length).padStart(4)} ${m.created.toISOString()} :: ${JSON.stringify(m.content.slice(0, 50))}`,
      )
    }
  }

  process.exit(0)
}

void main()
