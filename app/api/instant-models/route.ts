import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/db"
import { instantModels } from "@/db/schema"
import { getModel } from "@/lib/ai/models"
import { isProviderId } from "@/lib/ai/providers"
import { updateInstantModelSchema } from "@/lib/validations/instant-model"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }

  try {
    const rows = await db
      .select()
      .from(instantModels)
      .where(eq(instantModels.userId, session.user.id))

    const models = rows.flatMap((row) => {
      if (!isProviderId(row.provider) || !getModel(row.provider, row.modelId)) {
        return []
      }

      return [
        {
          provider: row.provider,
          modelId: row.modelId,
          enabled: row.enabled,
        },
      ]
    })

    return Response.json({ models })
  } catch {
    return Response.json({ error: "internal_error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }

  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return Response.json({ error: "invalid_payload" }, { status: 400 })
  }

  const parsed = updateInstantModelSchema.safeParse(payload)

  if (!parsed.success) {
    return Response.json(
      {
        error: "invalid_payload",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  const { provider, modelId, enabled } = parsed.data

  try {
    const [saved] = await db
      .insert(instantModels)
      .values({
        userId: session.user.id,
        provider,
        modelId,
        enabled,
      })
      .onConflictDoUpdate({
        target: [
          instantModels.userId,
          instantModels.provider,
          instantModels.modelId,
        ],
        set: {
          enabled,
          updatedAt: new Date(),
        },
      })
      .returning({
        provider: instantModels.provider,
        modelId: instantModels.modelId,
        enabled: instantModels.enabled,
      })

    return Response.json({ model: saved })
  } catch {
    return Response.json({ error: "internal_error" }, { status: 500 })
  }
}
