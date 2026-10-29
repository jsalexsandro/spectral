import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto"

const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 12
const VERSION = "v1"

function getEncryptionKey(): Buffer {
  const secret = process.env.BYOK_ENCRYPTION_KEY ?? process.env.AUTH_SECRET

  if (!secret) {
    throw new Error("BYOK_ENCRYPTION_KEY (ou AUTH_SECRET) não definida")
  }

  return createHash("sha256").update(secret).digest()
}

export function encryptSecret(plainText: string): string {
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, getEncryptionKey(), iv)
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()

  return [
    VERSION,
    iv.toString("base64"),
    tag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":")
}

export function decryptSecret(payload: string): string {
  const [version, iv, tag, data] = payload.split(":")

  if (version !== VERSION || !iv || !tag || !data) {
    throw new Error("Formato de segredo inválido")
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    Buffer.from(iv, "base64"),
  )
  decipher.setAuthTag(Buffer.from(tag, "base64"))

  return Buffer.concat([
    decipher.update(Buffer.from(data, "base64")),
    decipher.final(),
  ]).toString("utf8")
}

export function maskSecret(secret: string): string {
  return `••••${secret.trim().slice(-4)}`
}
