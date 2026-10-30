import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  safeValidateUIMessages,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai"
import { createId } from "@paralleldrive/cuid2"
import { auth } from "@/auth"
import { resolveChatModel } from "@/lib/ai/chat-model"
import {
  ensureOwnedChat,
  getChatTitle,
  getMessageText,
  saveChatMessage,
  touchChat,
} from "@/lib/ai/chat-service"
import { parseModelKey } from "@/lib/ai/models"
import { buildSystemPrompt } from "@/lib/ai/prompts"
import { getChatTools } from "@/lib/ai/tools"
import { sendChatMessageSchema } from "@/lib/validations/chat"

const modelErrorStatus = {
  unknown_model: 400,
  model_disabled: 403,
  missing_api_key: 403,
} as const

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }

  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return Response.json({ error: "invalid_payload" }, { status: 400 })
  }

  const parsed = sendChatMessageSchema.safeParse(payload)

  if (!parsed.success) {
    return Response.json(
      {
        error: "invalid_payload",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  const modelKey = parseModelKey(parsed.data.model)

  if (!modelKey) {
    return Response.json({ error: "unknown_model" }, { status: 400 })
  }

  const validation = await safeValidateUIMessages({
    messages: parsed.data.messages as UIMessage[],
  })

  if (!validation.success) {
    return Response.json({ error: "invalid_messages" }, { status: 400 })
  }

  const messages = validation.data
  const userMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user")

  if (!userMessage) {
    return Response.json({ error: "missing_user_message" }, { status: 400 })
  }

  const userText = getMessageText(userMessage)

  if (!userText) {
    return Response.json({ error: "empty_message" }, { status: 400 })
  }

  const { chatId } = parsed.data

  try {
    const resolved = await resolveChatModel(
      session.user.id,
      modelKey.provider,
      modelKey.modelId,
    )

    if (!resolved.ok) {
      return Response.json(
        { error: resolved.error },
        { status: modelErrorStatus[resolved.error] },
      )
    }

    const chatExists = await ensureOwnedChat({
      userId: session.user.id,
      chatId,
      title: getChatTitle(userText),
      provider: modelKey.provider,
      modelId: modelKey.modelId,
    })

    if (!chatExists) {
      return Response.json({ error: "chat_not_found" }, { status: 404 })
    }

    await saveChatMessage({
      id: userMessage.id,
      chatId,
      role: "user",
      content: userText,
      parts: userMessage.parts,
    })

    const systemPrompt = buildSystemPrompt({
      user: {
        name: session.user.name,
        nickname: session.user.nickname,
      },
      now: new Date(),
      model: {
        provider: modelKey.provider,
        modelId: modelKey.modelId,
      },
    })

    const result = streamText({
      model: resolved.model,
      system: systemPrompt.prompt,
      tools: getChatTools(),
      stopWhen: isStepCount(4),
      messages: await convertToModelMessages(
        messages.map((message) => ({
          role: message.role,
          parts: message.parts,
        })),
      ),
    })

    const stream = toUIMessageStream({
      stream: result.stream,
      originalMessages: messages,
      generateMessageId: () => createId(),
      onError: () => "Não foi possível gerar a resposta.",
      onEnd: async ({ responseMessage }) => {
        try {
          const usage = await result.usage
          const responseText = getMessageText(responseMessage)

          if (!responseText && responseMessage.parts.length === 0) {
            return
          }

          await saveChatMessage({
            id: responseMessage.id,
            chatId,
            role: responseMessage.role,
            content: responseText,
            parts: responseMessage.parts,
            provider: modelKey.provider,
            modelId: modelKey.modelId,
            promptVersion: systemPrompt.version,
            inputTokens: usage.inputTokens ?? null,
            outputTokens: usage.outputTokens ?? null,
          })
          await touchChat(chatId)
        } catch (error) {
          console.error("Falha ao salvar resposta do assistente:", error)
        }
      },
    })

    return createUIMessageStreamResponse({ stream })
  } catch {
    return Response.json({ error: "internal_error" }, { status: 500 })
  }
}
