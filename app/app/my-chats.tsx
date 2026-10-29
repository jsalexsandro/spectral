"use client"

import { useState } from "react"
import { Loader2, MessageSquare, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useChatSession, type ChatSummary } from "./chat-provider"

type MyChatsProps = {
  collapsed?: boolean
}

export function MyChats({ collapsed = false }: MyChatsProps) {
  const { chatId, isDraft, chats, chatsLoading, chatsError, openChat, deleteChat } =
    useChatSession()
  const [pendingDelete, setPendingDelete] = useState<ChatSummary | null>(null)

  if (collapsed) {
    return (
      <div className="mt-3 flex flex-col items-center gap-1 border-t border-border pt-3">
        {chats.slice(0, 12).map((chat) => (
          <Tooltip key={chat.id}>
            <TooltipTrigger
              type="button"
              onClick={() => void openChat(chat.id)}
              aria-current={!isDraft && chatId === chat.id ? "page" : undefined}
              className={cn(
                "flex size-8 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                !isDraft && chatId === chat.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <MessageSquare className="size-4" />
            </TooltipTrigger>
            <TooltipContent side="right">{chat.title}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    )
  }

  return (
    <div className="mt-4 min-h-0">
      <p className="px-2 pb-1 text-xs font-medium text-muted-foreground">
        Chats
      </p>

      {chatsLoading && chats.length === 0 ? (
        <p className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
          <Loader2 className="size-3 animate-spin" />
          Carregando...
        </p>
      ) : chatsError && chats.length === 0 ? (
        <p className="px-2 py-1.5 text-xs text-muted-foreground">
          Não foi possível carregar os chats.
        </p>
      ) : chats.length === 0 ? (
        <p className="px-2 py-1.5 text-xs text-muted-foreground">
          Nenhum chat ainda.
        </p>
      ) : (
        <ul className="space-y-0.5">
          {chats.map((chat) => {
            const active = !isDraft && chatId === chat.id

            return (
              <li
                key={chat.id}
                className={cn(
                  "group flex items-center gap-1 rounded-lg transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <button
                  type="button"
                  onClick={() => void openChat(chat.id)}
                  aria-current={active ? "page" : undefined}
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <MessageSquare className="size-3.5 shrink-0" />
                  <span className="truncate">{chat.title}</span>
                </button>
                <button
                  type="button"
                  aria-label={`Excluir ${chat.title}`}
                  title="Excluir chat"
                  onClick={() => setPendingDelete(chat)}
                  className="mr-1 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-ring hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDelete(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir chat?</AlertDialogTitle>
            <AlertDialogDescription>
              A conversa “{pendingDelete?.title}” e todas as mensagens serão
              removidas permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const chat = pendingDelete
                setPendingDelete(null)

                if (chat) {
                  void deleteChat(chat.id)
                }
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
