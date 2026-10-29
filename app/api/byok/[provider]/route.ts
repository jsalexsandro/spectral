import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { aiKeys } from "@/db/schema";
import { isProviderId } from "@/lib/ai/providers";
import { encryptSecret, maskSecret } from "@/lib/crypto";
import { saveProviderKeySchema } from "@/lib/validations/byok";

type RouteContext = { params: Promise<{ provider: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { provider } = await params;

  if (!isProviderId(provider)) {
    return Response.json({ error: "unknown_provider" }, { status: 404 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const parsed = saveProviderKeySchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json(
      {
        error: "invalid_payload",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const apiKey = parsed.data.apiKey;

  try {
    const encryptedKey = encryptSecret(apiKey);

    await db
      .insert(aiKeys)
      .values({
        userId: session.user.id,
        provider,
        apiKey: encryptedKey,
      })
      .onConflictDoUpdate({
        target: [aiKeys.userId, aiKeys.provider],
        set: {
          apiKey: encryptedKey,
          updatedAt: new Date(),
        },
      });

    return Response.json({
      provider,
      configured: true,
      maskedKey: maskSecret(apiKey),
    });
  } catch {
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { provider } = await params;

  if (!isProviderId(provider)) {
    return Response.json({ error: "unknown_provider" }, { status: 404 });
  }

  try {
    await db
      .delete(aiKeys)
      .where(
        and(
          eq(aiKeys.userId, session.user.id),
          eq(aiKeys.provider, provider),
        ),
      );

    return Response.json({ provider, configured: false });
  } catch {
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}
