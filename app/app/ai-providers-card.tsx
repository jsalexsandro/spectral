"use client"

import { KeyRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ByokProvider } from "@/lib/ai/providers"

type AiProvidersCardComponentProps = {
  provider: ByokProvider
  onConfigure: () => void
}

export function AiProvidersCardComponent({
  provider,
  onConfigure,
}: AiProvidersCardComponentProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <KeyRound className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium">{provider.name}</p>
          <Badge variant={provider.configured ? "secondary" : "outline"}>
            {provider.configured ? "Configurado" : "Não configurado"}
          </Badge>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {provider.description}
        </p>
        {provider.configured && provider.maskedKey && (
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            {provider.maskedKey}
          </p>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onConfigure}
        aria-label={`${provider.configured ? "Gerenciar" : "Configurar"} ${provider.name}`}
      >
        {provider.configured ? "Gerenciar" : "Configurar"}
      </Button>
    </div>
  )
}
