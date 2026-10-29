import { aiModels, getModelKey, type AIModel } from "./models"
import type { ProviderId } from "./providers"

export type InstantModelPreference = {
  provider: ProviderId
  modelId: string
  enabled: boolean
}

export function isInstantModelEnabled(
  model: Pick<AIModel, "provider" | "id">,
  preferences: readonly InstantModelPreference[],
): boolean {
  return (
    preferences.find(
      (preference) =>
        preference.provider === model.provider &&
        preference.modelId === model.id,
    )?.enabled ?? true
  )
}

export function getAvailableModels(
  configuredProviders: readonly ProviderId[],
): readonly AIModel[] {
  if (configuredProviders.length === 0) {
    return aiModels
  }

  return aiModels.filter((model) => configuredProviders.includes(model.provider))
}

export function getQuickModels(
  configuredProviders: readonly ProviderId[],
  preferences: readonly InstantModelPreference[],
): readonly AIModel[] {
  return getAvailableModels(configuredProviders).filter((model) =>
    isInstantModelEnabled(model, preferences),
  )
}

export function resolveDefaultModelKey(
  configuredProviders: readonly ProviderId[],
  preferences: readonly InstantModelPreference[],
): string {
  if (configuredProviders.length === 0) {
    return ""
  }

  const model = getQuickModels(configuredProviders, preferences)[0]

  return model ? getModelKey(model) : ""
}

export function upsertInstantPreference(
  preferences: readonly InstantModelPreference[],
  next: InstantModelPreference,
): InstantModelPreference[] {
  const index = preferences.findIndex(
    (preference) =>
      preference.provider === next.provider &&
      preference.modelId === next.modelId,
  )

  if (index === -1) {
    return [...preferences, next]
  }

  return preferences.map((preference, currentIndex) =>
    currentIndex === index ? next : preference,
  )
}
