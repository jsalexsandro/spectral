import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { aiKeys } from "@/db/schema";
import { aiProviders } from "@/lib/ai/providers";
import { decryptSecret, maskSecret } from "@/lib/crypto";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const rows = await db
      .select()
      .from(aiKeys)
      .where(eq(aiKeys.userId, session.user.id));

    const byProvider = new Map(rows.map((row) => [row.provider, row]));

    const providers = aiProviders.map((provider) => {
      const row = byProvider.get(provider.id);

      if (!row) {
        return {
          ...provider,
          configured: false,
          maskedKey: null,
          updatedAt: null,
        };
      }

      let maskedKey: string | null = null;

      try {
        maskedKey = maskSecret(decryptSecret(row.apiKey));
      } catch {
        maskedKey = null;
      }

      return {
        ...provider,
        configured: true,
        maskedKey,
        updatedAt: row.updatedAt,
      };
    });

    return Response.json({ providers });
  } catch {
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}
