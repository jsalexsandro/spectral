"use client"

import { Bot, ChevronDown } from "lucide-react"

export const chatModels = [
  { value: "spectral-fast", label: "Spectral Fast" },
  { value: "spectral-pro", label: "Spectral Pro" },
  { value: "spectral-reasoning", label: "Spectral Reasoning" },
] as const

export type ChatModel = (typeof chatModels)[number]["value"]

type ModelSelectProps = {
  value: ChatModel
  onChange: (value: ChatModel) => void
}

export function ModelSelect({ value, onChange }: ModelSelectProps) {
  return (
    <div className="relative shrink-0">
      <Bot
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <select
        aria-label="Modelo"
        value={value}
        onChange={(event) => onChange(event.target.value as ChatModel)}
        className="h-9 appearance-none rounded-lg border border-border bg-transparent pr-7 pl-8 text-xs font-medium text-foreground outline-none transition-colors hover:bg-accent focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {chatModels.map((model) => (
          <option key={model.value} value={model.value}>
            {model.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  )
}
