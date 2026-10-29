"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import {
  PanelLeft,
  Settings,
  Info,
  LogOut,
  MessageSquarePlus,
  Search,
} from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useChatSession } from "./chat-provider"
import { ConfigComponent } from "./config-component"
import { OptionComponent } from "./option-component"

type SidebarUser = {
  name?: string | null
  email?: string | null
  image?: string | null
}

function getInitials(user: SidebarUser) {
  const source = user.name?.trim() || user.email?.trim() || "?"
  const parts = source.split(/[\s@._-]+/).filter(Boolean)

  if (parts.length === 0) {
    return "?"
  }

  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
}

export function AppSidebar({ user }: { user: SidebarUser }) {
  const [open, setOpen] = useState(true)
  const [configOpen, setConfigOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { startNewChat } = useChatSession()

  function handleSearchOpenChange(nextOpen: boolean) {
    setSearchOpen(nextOpen)

    if (!nextOpen) {
      setSearchQuery("")
    }
  }
  const displayName = user.name?.trim() || user.email || "Usuário"

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200 ease-out",
        open ? "w-64" : "w-16",
      )}
    >
      <header className="flex h-14 items-center gap-3 border-b border-border px-3">
        <Tooltip>
          <TooltipTrigger
            type="button"
            aria-label={open ? "Fechar sidebar" : "Abrir sidebar"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <PanelLeft className="size-5" />
          </TooltipTrigger>
          <TooltipContent side="right">
            {open ? "Fechar sidebar" : "Abrir sidebar"}
          </TooltipContent>
        </Tooltip>

        <span
          className={cn(
            "font-heading text-lg font-semibold tracking-tight whitespace-nowrap transition-opacity duration-200",
            open ? "opacity-100" : "pointer-events-none w-0 opacity-0",
          )}
        >
          Spectral
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        <OptionComponent
          icon={MessageSquarePlus}
          label="Novo Chat"
          active
          collapsed={!open}
          onClick={startNewChat}
        />
        <OptionComponent
          icon={Search}
          label="Pesquisar"
          collapsed={!open}
          onClick={() => setSearchOpen(true)}
        />
      </div>

      <footer className="border-t border-border p-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Menu do usuário"
            className={cn(
              "flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring",
              !open && "justify-center px-0",
            )}
          >
            <Avatar className="shrink-0">
              {user.image && <AvatarImage src={user.image} alt="" />}
              <AvatarFallback>{getInitials(user)}</AvatarFallback>
            </Avatar>
            <span
              className={cn(
                "min-w-0 flex-1 overflow-hidden transition-opacity duration-200",
                open ? "opacity-100" : "pointer-events-none w-0 opacity-0",
              )}
            >
              <span className="block truncate text-sm font-medium">
                {displayName}
              </span>
              {user.email && (
                <span className="block truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              )}
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            side="top"
            sideOffset={8}
            className={cn(!open && "ml-4")}
          >
            <DropdownMenuItem onClick={() => setConfigOpen(true)}>
              <Settings />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Info />
              Saiba Mais
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setSignOutOpen(true)}
            >
              <LogOut />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </footer>

      <ConfigComponent
        open={configOpen}
        onOpenChange={setConfigOpen}
        user={user}
      />

      <Dialog open={searchOpen} onOpenChange={handleSearchOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pesquisar chat</DialogTitle>
            <DialogDescription>
              Digite o nome do chat que você procura.
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Nome do chat..."
              aria-label="Nome do chat"
              autoFocus
              className="h-11 pl-9"
            />
          </div>
          {searchQuery.trim() && (
            <p className="text-sm text-muted-foreground">
              Nenhum chat encontrado para “{searchQuery.trim()}”.
            </p>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={signOutOpen} onOpenChange={setSignOutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sair da conta?</AlertDialogTitle>
            <AlertDialogDescription>
              Você precisará entrar novamente para acessar o painel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void signOut({ redirectTo: "/login" })
              }}
            >
              Sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  )
}
