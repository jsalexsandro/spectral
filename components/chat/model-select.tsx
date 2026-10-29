"use client"

import { useEffect, useMemo, useState } from "react"
import { Bot, ChevronDown, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  getAvailableModels,
  getQuickModels,
  isInstantModelEnabled,
  upsertInstantPreference,
  type InstantModelPreference,
} from "@/lib/ai/instant-models"
import { aiModels, getModelKey, type AIModel } from "@/lib/ai/models"
import { aiProviders, isProviderId, type ProviderId } from "@/lib/ai/providers"

type ModelSelectProps = {
  value: string
  onChange: (value: string) => void
  configuredProviders: readonly ProviderId[]
  instantPreferences: readonly InstantModelPreference[]
}

export function ModelSelect({
  value,
  onChange,
  configuredProviders,
  instantPreferences,
}: ModelSelectProps) {
  const [open, setOpen] = useState(false)
  const [providers, setProviders] =
    useState<readonly ProviderId[]>(configuredProviders)
  const [preferences, setPreferences] =
    useState<readonly InstantModelPreference[]>(instantPreferences)
  const [pendingKeys, setPendingKeys] = useState<readonly string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    let cancelled = false

    async function refreshProviders() {
      try {
        const response = await fetch("/api/byok", { cache: "no-store" })

        if (!response.ok) {
          return
        }

        const data = (await response.json()) as {
          providers?: { id: string; configured: boolean }[]
        }

        if (cancelled) {
          return
        }

        const next = (data.providers ?? [])
          .filter((provider) => provider.configured && isProviderId(provider.id))
          .map((provider) => provider.id as ProviderId)

        setProviders(next)
      } catch {
        // Mantém a última lista conhecida em caso de falha.
      }
    }

    void refreshProviders()

    return () => {
      cancelled = true
    }
  }, [open])

  const availableModels = useMemo(
    () => getAvailableModels(providers),
    [providers],
  )

  const quickModels = useMemo(
    () => getQuickModels(providers, preferences),
    [providers, preferences],
  )

  const groups = useMemo(
    () =>
      aiProviders
        .map((provider) => ({
          provider,
          models: availableModels.filter(
            (model) => model.provider === provider.id,
          ),
        }))
        .filter((group) => group.models.length > 0),
    [availableModels],
  )

  const selectedModel = useMemo(
    () => aiModels.find((model) => getModelKey(model) === value),
    [value],
  )

  useEffect(() => {
    if (quickModels.length === 0) {
      return
    }

    if (!quickModels.some((model) => getModelKey(model) === value)) {
      onChange(getModelKey(quickModels[0]))
    }
  }, [quickModels, value, onChange])

  async function handleToggle(model: AIModel, enabled: boolean) {
    const key = getModelKey(model)

    if (pendingKeys.includes(key)) {
      return
    }

    setError(null)
    setPreferences((current) =>
      upsertInstantPreference(current, {
        provider: model.provider,
        modelId: model.id,
        enabled,
      }),
    )
    setPendingKeys((current) => [...current, key])

    try {
      const response = await fetch("/api/instant-models", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: model.provider,
          modelId: model.id,
          enabled,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao salvar")
      }
    } catch {
      setPreferences((current) =>
        upsertInstantPreference(current, {
          provider: model.provider,
          modelId: model.id,
          enabled: !enabled,
        }),
      )
      setError("Não foi possível salvar a preferência. Tente novamente.")
    } finally {
      setPendingKeys((current) => current.filter((item) => item !== key))
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        aria-label="Selecionar modelo"
        title="Selecionar modelo"
        className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-transparent px-2.5 text-xs font-medium text-foreground outline-none transition-colors hover:bg-accent focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Bot aria-hidden className="size-4 text-muted-foreground" />
        <span className="max-w-36 truncate">
          {selectedModel?.name ?? "Modelo"}
        </span>
        <ChevronDown
          aria-hidden
          className="size-3.5 text-muted-foreground"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="top" sideOffset={8} className="w-72">
        <DropdownMenuLabel>Usar modelo</DropdownMenuLabel>

        {quickModels.length === 0 ? (
          <p className="px-2 py-1.5 text-xs text-muted-foreground">
            Nenhum modelo rápido ativo. Ative um abaixo.
          </p>
        ) : (
          <DropdownMenuRadioGroup
            value={value}
            onValueChange={(next) => onChange(String(next))}
          >
            {groups.map(({ provider, models }) => {
              const quick = models.filter((model) =>
                quickModels.some(
                  (item) => getModelKey(item) === getModelKey(model),
                ),
              )

              if (quick.length === 0) {
                return null
              }

              return (
                <DropdownMenuGroup key={provider.id}>
                  <DropdownMenuLabel>{provider.name}</DropdownMenuLabel>
                  {quick.map((model) => (
                    <DropdownMenuRadioItem
                      key={getModelKey(model)}
                      value={getModelKey(model)}
                      closeOnClick
                    >
                      <span className="truncate">{model.name}</span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuGroup>
              )
            })}
          </DropdownMenuRadioGroup>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Modelos rápidos</DropdownMenuLabel>

        {groups.length === 0 ? (
          <p className="px-2 py-1.5 text-xs text-muted-foreground">
            Nenhum modelo disponível.
          </p>
        ) : (
          groups.map(({ provider, models }) => (
            <DropdownMenuGroup key={provider.id}>
              <DropdownMenuLabel>{provider.name}</DropdownMenuLabel>
              {models.map((model) => {
                const key = getModelKey(model)
                const isPending = pendingKeys.includes(key)

                return (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={isInstantModelEnabled(model, preferences)}
                    onCheckedChange={(checked) => {
                      void handleToggle(model, checked)
                    }}
                    disabled={isPending}
                    closeOnClick={false}
                  >
                    {isPending && (
                      <Loader2 className="size-3 animate-spin text-muted-foreground" />
                    )}
                    <span className="truncate">{model.name}</span>
                  </DropdownMenuCheckboxItem>
                )
              })}
            </DropdownMenuGroup>
          ))
        )}

        {error && (
          <p role="alert" className="px-2 py-1.5 text-xs text-destructive">
            {error}
          </p>
        )}

        {providers.length === 0 && (
          <p className="px-2 py-1.5 text-xs text-muted-foreground">
            Configure uma chave em BYOK para usar seus provedores.
          </p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
