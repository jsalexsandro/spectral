"use client"

import { useState } from "react"
import { ArrowUp } from "lucide-react"

type ChatProps = {
  greeting?: string
}

export function Chat({ greeting = "Olá!" }: ChatProps) {
  const [message, setMessage] = useState("")

  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center gap-8 overflow-y-auto px-4">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        {greeting}
      </h1>

      <form
        className="w-full max-w-2xl"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-3 shadow-soft focus-within:border-primary/50 focus-within:ring-3 focus-within:ring-primary/10">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Como posso ajudar você hoje?"
            rows={1}
            aria-label="Mensagem"
            className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            aria-label="Enviar mensagem"
            disabled
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors opacity-50 cursor-not-allowed"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
