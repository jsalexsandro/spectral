"use client"

import { useState } from "react"
import {
  Check,
  Copy,
  KeyRound,
  Monitor,
  Moon,
  RefreshCw,
  Settings,
  Sun,
  User,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTheme, type Theme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

type ConfigSection = "general" | "account" | "api-key"

type ConfigUser = {
  name?: string | null
  email?: string | null
  image?: string | null
}

type ConfigComponentProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: ConfigUser
}

const sections: {
  id: ConfigSection
  label: string
  icon: typeof Settings
}[] = [
  { id: "general", label: "Geral", icon: Settings },
  { id: "account", label: "Conta", icon: User },
  { id: "api-key", label: "Chave de API", icon: KeyRound },
]

const themeOptions: {
  value: Theme
  label: string
  icon: typeof Sun
}[] = [
  { value: "system", label: "Sistema", icon: Monitor },
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
]

function getInitials(user: ConfigUser) {
  const source = user.name?.trim() || user.email?.trim() || "?"
  const parts = source.split(/[\s@._-]+/).filter(Boolean)

  if (parts.length === 0) {
    return "?"
  }

  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
}

export function ConfigComponent({
  open,
  onOpenChange,
  user,
}: ConfigComponentProps) {
  const [section, setSection] = useState<ConfigSection>("general")
  const [apiKey, setApiKey] = useState("")
  const [copied, setCopied] = useState(false)

  const displayName = user.name?.trim() || user.email || "Usuário"

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)

    if (!nextOpen) {
      setSection("general")
      setCopied(false)
    }
  }

  function generateApiKey() {
    setApiKey(`sk_spectral_${crypto.randomUUID().replace(/-/g, "")}`)
    setCopied(false)
  }

  async function copyApiKey() {
    if (!apiKey) {
      return
    }

    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent padded={false} className="max-w-2xl">
        <DialogTitle className="sr-only">Configurações</DialogTitle>
        <DialogDescription className="sr-only">
          Aparência, conta e chave de API.
        </DialogDescription>

        <div className="grid sm:grid-cols-[200px_1fr]">
          <aside className="border-b border-border bg-muted/40 p-4 sm:border-r sm:border-b-0">
            <p className="mb-3 px-2 font-heading text-sm font-semibold">
              Configurações
            </p>
            <nav className="flex gap-1 overflow-x-auto sm:flex-col sm:overflow-visible">
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSection(id)}
                  aria-current={section === id ? "page" : undefined}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                    section === id
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <section className="min-h-[320px] p-6">
            {section === "general" && <GeneralSection />}
            {section === "account" && (
              <AccountSection user={user} displayName={displayName} />
            )}
            {section === "api-key" && (
              <ApiKeySection
                apiKey={apiKey}
                copied={copied}
                onGenerate={generateApiKey}
                onCopy={copyApiKey}
              />
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function GeneralSection() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h3 className="font-heading text-base font-semibold">Aparência</h3>
        <p className="text-sm text-muted-foreground">
          Escolha como o Spectral deve aparecer.
        </p>
      </header>

      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">Tema</p>
          <p className="text-xs text-muted-foreground">
            O modo sistema acompanha a preferência do seu dispositivo.
          </p>
        </div>

        <div
          role="group"
          aria-label="Tema"
          className="grid grid-cols-3 gap-2"
        >
          {themeOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={theme === value}
              onClick={() => setTheme(value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                theme === value
                  ? "border-primary bg-primary/5 font-medium text-primary"
                  : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="size-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function AccountSection({
  user,
  displayName,
}: {
  user: ConfigUser
  displayName: string
}) {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h3 className="font-heading text-base font-semibold">Conta</h3>
        <p className="text-sm text-muted-foreground">
          Informações da sua conta.
        </p>
      </header>

      <div className="flex items-center gap-3 rounded-xl border border-border p-4">
        <Avatar className="size-12 shrink-0">
          {user.image && <AvatarImage src={user.image} alt="" />}
          <AvatarFallback>{getInitials(user)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{displayName}</p>
          {user.email && (
            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          )}
        </div>
      </div>

      <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
        Mais opções de conta estarão disponíveis em breve.
      </p>
    </div>
  )
}

function ApiKeySection({
  apiKey,
  copied,
  onGenerate,
  onCopy,
}: {
  apiKey: string
  copied: boolean
  onGenerate: () => void
  onCopy: () => void
}) {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h3 className="font-heading text-base font-semibold">Chave de API</h3>
        <p className="text-sm text-muted-foreground">
          Use esta chave para autenticar suas integrações.
        </p>
      </header>

      <div className="space-y-2">
        <Label htmlFor="api-key">Chave</Label>
        <div className="flex gap-2">
          <Input
            id="api-key"
            readOnly
            value={apiKey}
            placeholder="Nenhuma chave gerada"
            className="h-10 font-mono text-xs"
          />
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            onClick={onCopy}
            disabled={!apiKey}
            aria-label="Copiar chave"
          >
            {copied ? <Check /> : <Copy />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          A chave é gerada apenas nesta sessão e ainda não é salva.
        </p>
      </div>

      <Button type="button" onClick={onGenerate}>
        {apiKey ? <RefreshCw /> : <KeyRound />}
        {apiKey ? "Gerar nova chave" : "Gerar chave"}
      </Button>
    </div>
  )
}
