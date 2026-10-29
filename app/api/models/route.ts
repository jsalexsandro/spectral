import {
  MODEL_CATALOG_VERSION,
  getProviderModelsCatalog,
} from "@/lib/ai/models"

export function GET() {
  return Response.json({
    version: MODEL_CATALOG_VERSION,
    providers: getProviderModelsCatalog(),
  })
}
