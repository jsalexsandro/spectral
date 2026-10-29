import { desc, eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/db"
import { chats } from "@/db/schema"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }

  try {
    const rows = await db
      .select({
        id: chats.id,
        title: chats.title,
        provider: chats.provider,
        model: chats.model,
        updatedAt: chats.updatedAt,
      })
      .from(chats)
      .where(eq(chats.userId, session.user.id))
      .orderBy(desc(chats.updatedAt))
      .limit(100)

    return Response.json({ chats: rows })
  } catch {
    return Response.json({ error: "internal_error" }, { status: 500 })
  }
}
