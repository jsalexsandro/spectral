"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type ChatContextValue = {
  chatId: number
  startNewChat: () => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chatId, setChatId] = useState(0)

  const startNewChat = useCallback(() => {
    setChatId((current) => current + 1)
  }, [])

  const value = useMemo(
    () => ({ chatId, startNewChat }),
    [chatId, startNewChat],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChatSession() {
  const context = useContext(ChatContext)

  if (!context) {
    throw new Error("useChatSession deve ser usado dentro de ChatProvider")
  }

  return context
}
