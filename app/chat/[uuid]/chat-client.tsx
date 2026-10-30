"use client"

import { useEffect } from "react"
import { useChatSession } from "@/app/app/chat-provider"
import { Chat } from "@/components/chat/chat"
import type { InstantModelPreference } from "@/lib/ai/instant-models"
import type { ProviderId } from "@/lib/ai/providers"

type ChatClientProps = {
  uuid: string
  configuredProviders: readonly ProviderId[]
  instantPreferences: readonly InstantModelPreference[]
}

export function ChatClient({
  uuid,
  configuredProviders,
  instantPreferences,
}: ChatClientProps) {
  const { openChat } = useChatSession()

  useEffect(() => {
    const handleOpen = async () => {
      await openChat(uuid)
    }
    handleOpen()
  }, [uuid, openChat])

  return (
    <Chat
      configuredProviders={configuredProviders}
      instantPreferences={instantPreferences}
    />
  )
}
