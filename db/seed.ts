import { existsSync, readFileSync } from "node:fs"
import { hashPassword } from "../lib/password"
import { users } from "./schema"

const DEFAULT_EMAIL = "admin@admin.com"
const DEFAULT_PASSWORD = "admin123"
const DEFAULT_NAME = "Admin"

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) {
      continue
    }

    for (const rawLine of readFileSync(file, "utf8").split("\n")) {
      const line = rawLine.trim()

      if (!line || line.startsWith("#")) {
        continue
      }

      const separatorIndex = line.indexOf("=")

      if (separatorIndex === -1) {
        continue
      }

      const key = line.slice(0, separatorIndex).trim()

      if (!key || process.env[key] !== undefined) {
        continue
      }

      let value = line.slice(separatorIndex + 1).trim()

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }

      process.env[key] = value
    }
  }
}

async function main() {
  loadEnv()

  const { db } = await import("./index")

  const email = (process.env.SEED_ADMIN_EMAIL ?? DEFAULT_EMAIL)
    .trim()
    .toLowerCase()
  const password = process.env.SEED_ADMIN_PASSWORD ?? DEFAULT_PASSWORD
  const name = process.env.SEED_ADMIN_NAME ?? DEFAULT_NAME

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não definida (.env.local ou .env)")
  }

  const passwordHash = await hashPassword(password)

  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      password: passwordHash,
      emailVerified: new Date(),
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        name,
        password: passwordHash,
        emailVerified: new Date(),
        updatedAt: new Date(),
      },
    })
    .returning({ id: users.id, email: users.email })

  console.log("Usuário de teste pronto:")
  console.log(`  id:    ${user.id}`)
  console.log(`  e-mail: ${user.email}`)
  console.log(`  senha:  ${password}`)

  process.exit(0)
}

main().catch((error) => {
  console.error("Falha ao criar o usuário de teste.")
  console.error(error)
  process.exit(1)
})
