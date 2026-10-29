"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUp, Paperclip } from "lucide-react"
import { useChatSession } from "@/app/app/chat-provider"
import {
  resolveDefaultModelKey,
  type InstantModelPreference,
} from "@/lib/ai/instant-models"
import type { ProviderId } from "@/lib/ai/providers"
import { ModelSelect } from "./model-select"

type ChatProps = {
  greeting?: string
  configuredProviders: readonly ProviderId[]
  instantPreferences: readonly InstantModelPreference[]
}

type ChatMessage = {
  id: number
  role: "user"
  content: string
}

const MAX_TEXTAREA_HEIGHT = 240

export function Chat({
  greeting = "Olá!",
  configuredProviders,
  instantPreferences,
}: ChatProps) {
  const { chatId } = useChatSession()
  const [message, setMessage] = useState("")
  const [model, setModel] = useState(() =>
    resolveDefaultModelKey(configuredProviders, instantPreferences),
  )
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const canSend = message.trim().length > 0
  const hasMessages = messages.length > 0

  useEffect(() => {
    setMessages([])
    setMessage("")
  }, [chatId])

  useEffect(() => {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      MAX_TEXTAREA_HEIGHT,
    )}px`
  }, [message])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const content = message.trim()

    if (!content) {
      return
    }

    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user", content },
    ])
    setMessage("")
    textareaRef.current?.focus()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {hasMessages ? (
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
            {messages.map((item) => (
              <div
                key={item.id}
                className="max-w-[85%] self-end rounded-2xl bg-primary px-4 py-2.5 text-sm break-words whitespace-pre-wrap text-primary-foreground"
              >
                {item.content}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center px-4">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {greeting}
          </h1>
        </div>
      )}

      <div className="px-4 pt-2 pb-6">
        <form className="mx-auto w-full max-w-2xl" onSubmit={handleSubmit}>
          <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-3 shadow-soft focus-within:border-primary/50 focus-within:ring-3 focus-within:ring-primary/10">
            <button
              type="button"
              aria-label="Anexar arquivo"
              title="Anexar arquivo"
              disabled
              className="flex size-9 shrink-0 cursor-not-allowed items-center justify-center rounded-lg text-muted-foreground opacity-50"
            >
              <Paperclip className="size-4" />
            </button>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Como posso ajudar você hoje?"
              rows={1}
              aria-label="Mensagem"
              className="max-h-60 min-h-10 flex-1 resize-none overflow-y-auto bg-transparent px-1 py-2 text-sm outline-none [scrollbar-width:none] placeholder:text-muted-foreground [&::-webkit-scrollbar]:hidden"
            />
            <ModelSelect
              value={model}
              onChange={setModel}
              configuredProviders={configuredProviders}
              instantPreferences={instantPreferences}
            />
            <button
              type="submit"
              aria-label="Enviar mensagem"
              disabled={!canSend}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Enter para enviar · Shift+Enter para quebrar linha
          </p>
        </form>
      </div>
    </div>
  )
}
