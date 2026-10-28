import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { checkEmailSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }

  const parsed = checkEmailSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }

  try {
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, parsed.data.email))
      .limit(1);

    return Response.json({ exists: Boolean(user) });
  } catch {
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}
