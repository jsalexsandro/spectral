import { and, asc, eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/db"
import { chatMessages, chats } from "@/db/schema"
import { deleteOwnedChat } from "@/lib/ai/chat-service"
import z from "zod"

type RouteContext = { params: Promise<{ id: string }> }

const updateChatTitleSchema = z.object({
  title: z.string().min(1, "Título não pode ficar vazio").max(200),
})

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

export async function PATCH(_request: Request, { params }: RouteContext) {
  const session = await auth()

  if (!session?.user?.id) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }

  const { id } = await params

  let body: unknown

  try {
    body = await _request.json()
  } catch {
    return Response.json({ error: "invalid_payload" }, { status: 400 })
  }

  const parsed = updateChatTitleSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json(
      { error: "invalid_payload", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  try {
    const updated = await db
      .update(chats)
      .set({ title: parsed.data.title })
      .where(and(eq(chats.id, id), eq(chats.userId, session.user.id)))
      .returning({ id: chats.id, title: chats.title })

    if (!updated.length) {
      return Response.json({ error: "chat_not_found" }, { status: 404 })
    }

    return Response.json({ ok: true, chat: updated[0] })
  } catch {
    return Response.json({ error: "internal_error" }, { status: 500 })
  }
}
