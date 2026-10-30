import type { Metadata } from "next"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/db"
import { aiKeys, instantModels } from "@/db/schema"
import { getModel } from "@/lib/ai/models"
import { isProviderId, type ProviderId } from "@/lib/ai/providers"
import type { InstantModelPreference } from "@/lib/ai/instant-models"
import { ChatClient } from "./chat-client"

export const instant = false

export const metadata: Metadata = {
  title: "Chat",
  description: "Conversa no Spectral AI.",
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params
  const session = await auth()
  const user = session?.user

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
    <ChatClient
      uuid={uuid}
      configuredProviders={configuredProviders}
      instantPreferences={instantPreferences}
    />
  )
}
