import {
  MODEL_CATALOG_VERSION,
  getProviderModelCatalog,
} from "@/lib/ai/models"
import { aiProviders, isProviderId } from "@/lib/ai/providers"

type RouteContext = { params: Promise<{ provider: string }> }

export function generateStaticParams() {
  return aiProviders.map((provider) => ({ provider: provider.id }))
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { provider } = await params

  if (!isProviderId(provider)) {
    return Response.json({ error: "unknown_provider" }, { status: 404 })
  }

  const catalog = getProviderModelCatalog(provider)

  if (!catalog) {
    return Response.json({ error: "unknown_provider" }, { status: 404 })
  }

  return Response.json({
    version: MODEL_CATALOG_VERSION,
    provider: catalog.id,
    name: catalog.name,
    description: catalog.description,
    models: catalog.models,
  })
}
