import type { Metadata } from "next"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/db"
import { aiKeys, instantModels } from "@/db/schema"
import { getModel } from "@/lib/ai/models"
import { isProviderId, type ProviderId } from "@/lib/ai/providers"
import type { InstantModelPreference } from "@/lib/ai/instant-models"
import { Chat } from "@/components/chat/chat"

export const instant = false

export const metadata: Metadata = {
  title: "Plataforma",
  description: "Painel do Spectral AI.",
}

export default async function AppPage() {
  const session = await auth()
  const user = session?.user

  const firstName =
    user?.name?.trim().split(" ")[0] || user?.email?.split("@")[0] || ""

  let configuredProviders: ProviderId[] = []
  let instantPreferences: InstantModelPreference[] = []

  if (user?.id) {
    const [keys, preferences] = await Promise.all([
      db
        .select({ provider: aiKeys.provider })
        .from(aiKeys)
        .where(eq(aiKeys.userId, user.id)),
      db
        .select({
          provider: instantModels.provider,
          modelId: instantModels.modelId,
          enabled: instantModels.enabled,
        })
        .from(instantModels)
        .where(eq(instantModels.userId, user.id)),
    ])

    configuredProviders = Array.from(
      new Set(
        keys
          .map((key) => key.provider)
          .filter((provider): provider is ProviderId => isProviderId(provider)),
      ),
    )

    instantPreferences = preferences.flatMap((preference) => {
      if (
        !isProviderId(preference.provider) ||
        !getModel(preference.provider, preference.modelId)
      ) {
        return []
      }

      return [
        {
          provider: preference.provider,
          modelId: preference.modelId,
          enabled: preference.enabled,
        },
      ]
    })
  }

  return (
    <Chat
      greeting={`Olá, ${firstName}!`}
      configuredProviders={configuredProviders}
      instantPreferences={instantPreferences}
    />
  )
}
