import { and, asc, eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/db"
import { chatMessages, chats } from "@/db/schema"
import { deleteOwnedChat } from "@/lib/ai/chat-service"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  const session = await auth()

  if (!session?.user?.id) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const [chat] = await db
      .select({
        id: chats.id,
        title: chats.title,
        provider: chats.provider,
        model: chats.model,
        updatedAt: chats.updatedAt,
      })
      .from(chats)
      .where(and(eq(chats.id, id), eq(chats.userId, session.user.id)))
      .limit(1)

    if (!chat) {
      return Response.json({ error: "chat_not_found" }, { status: 404 })
    }

    const rows = await db
      .select({
        id: chatMessages.id,
        role: chatMessages.role,
        parts: chatMessages.parts,
        createdAt: chatMessages.createdAt,
      })
      .from(chatMessages)
      .where(eq(chatMessages.chatId, chat.id))
      .orderBy(asc(chatMessages.createdAt))

    return Response.json({ chat, messages: rows })
  } catch {
    return Response.json({ error: "internal_error" }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await auth()

  if (!session?.user?.id) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const deleted = await deleteOwnedChat(session.user.id, id)

    if (!deleted) {
      return Response.json({ error: "chat_not_found" }, { status: 404 })
    }

    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: "internal_error" }, { status: 500 })
  }
}
