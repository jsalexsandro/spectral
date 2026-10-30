import { tool } from "ai"
import { lookup } from "node:dns/promises"
import { isIP } from "node:net"
import { z } from "zod"

const REQUEST_TIMEOUT_MS = 12_000
const MAX_REDIRECTS = 3
const MAX_BODY_BYTES = 256 * 1024

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"])
const ALLOWED_METHODS = ["GET", "POST"] as const
const TEXT_CONTENT_TYPES = new Set([
  "application/json",
  "application/ld+json",
  "application/xml",
  "application/xhtml+xml",
  "application/rss+xml",
  "application/atom+xml",
  "application/javascript",
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isPrivateIpv4(host: string): boolean {
  const parts = host.split(".")

  if (parts.length !== 4) {
    return false
  }

  const numbers = parts.map(Number)

  if (numbers.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false
  }

  const [a, b] = numbers

  if (a === 0 || a === 10 || a === 127) return true
  if (a === 169 && b === 254) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  if (a === 100 && b >= 64 && b <= 127) return true
  if (a === 198 && (b === 18 || b === 19)) return true
  if (a >= 224) return true

  return false
}

function isPrivateIpv6(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "")

  if (host === "::" || host === "::1") return true
  if (host.startsWith("fc") || host.startsWith("fd")) return true
  if (/^fe[89ab]/.test(host)) return true
  if (host.startsWith("ff")) return true
  if (host.startsWith("::ffff:")) return isPrivateIpv4(host.slice("::ffff:".length))

  return false
}

function isBlockedHostname(hostname: string): boolean {
  const host = hostname.toLowerCase()

  return (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host.endsWith(".home.arpa")
  )
}

function isPrivateAddress(address: string, family: number): boolean {
  return family === 4 ? isPrivateIpv4(address) : isPrivateIpv6(address)
}

async function assertPublicUrl(raw: string): Promise<URL> {
  let url: URL

  try {
    url = new URL(raw)
  } catch {
    throw new Error("URL inválida.")
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    throw new Error("Apenas URLs http e https são permitidas.")
  }

  if (url.username || url.password) {
    throw new Error("URLs com credenciais não são permitidas.")
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, "")

  if (isBlockedHostname(hostname)) {
    throw new Error("Hosts locais ou internos não são permitidos.")
  }

  const version = isIP(hostname)

  if (version) {
    if (isPrivateAddress(hostname, version)) {
      throw new Error("Endereços de rede privada não são permitidos.")
    }

    return url
  }

  const records = await lookup(hostname, { all: true, verbatim: true })

  if (records.length === 0) {
    throw new Error("Não foi possível resolver o host.")
  }

  if (records.some((record) => isPrivateAddress(record.address, record.family))) {
    throw new Error("Endereços de rede privada não são permitidos.")
  }

  return url
}

function isTextContentType(contentType: string): boolean {
  const base = contentType.split(";")[0]?.trim().toLowerCase() ?? ""

  if (!base) {
    return true
  }

  return base.startsWith("text/") || TEXT_CONTENT_TYPES.has(base)
}

async function readBody(response: Response): Promise<{
  body: string
  truncated: boolean
}> {
  const reader = response.body?.getReader()

  if (!reader) {
    return { body: "", truncated: false }
  }

  const decoder = new TextDecoder()
  let body = ""
  let bytes = 0
  let truncated = false

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      break
    }

    bytes += value.byteLength

    if (bytes > MAX_BODY_BYTES) {
      const overflow = bytes - MAX_BODY_BYTES
      const kept = value.subarray(0, Math.max(0, value.byteLength - overflow))
      body += decoder.decode(kept, { stream: false })
      truncated = true
      await reader.cancel()
      break
    }

    body += decoder.decode(value, { stream: true })
  }

  body += decoder.decode()

  return { body, truncated }
}

export const fetchUrlTool = tool({
  description:
    "Faz uma requisição HTTP (GET ou POST) para uma URL pública e retorna o corpo em texto ou JSON. Use quando o usuário pedir informações atuais, dados de uma API pública ou conteúdo de uma página. Não funciona com localhost, IPs privados ou serviços internos. Para POST, envie o corpo JSON no campo body. Sempre cite a URL consultada na resposta.",
  inputSchema: z.object({
    url: z.string().url().describe("URL pública http(s) a ser consultada."),
    method: z
      .enum(ALLOWED_METHODS)
      .default("GET")
      .describe("Método HTTP. Use GET por padrão; POST apenas quando a API exigir."),
    body: z
      .string()
      .optional()
      .describe("Corpo da requisição em JSON. Apenas para POST."),
  }),
  execute: async ({ url, method, body }) => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
      if (method === "POST" && body !== undefined) {
        try {
          JSON.parse(body)
        } catch {
          return { ok: false, error: "O corpo enviado em POST não é um JSON válido." }
        }
      }

      let current = await assertPublicUrl(url)
      let response: Response | null = null
      let redirects = 0

      while (true) {
        response = await fetch(current, {
          method,
          body: method === "POST" ? body : undefined,
          redirect: "manual",
          signal: controller.signal,
          headers: {
            accept: "text/html,application/json,text/plain;q=0.9,*/*;q=0.8",
            "user-agent": "SpectralAI/1.0",
            ...(method === "POST" ? { "content-type": "application/json" } : {}),
          },
        })

        if (response.status < 300 || response.status >= 400) {
          break
        }

        const location = response.headers.get("location")

        if (!location) {
          break
        }

        redirects += 1

        if (redirects > MAX_REDIRECTS) {
          return { ok: false, error: "Muitos redirecionamentos." }
        }

        current = await assertPublicUrl(new URL(location, current).toString())
      }

      const contentType = response.headers.get("content-type") ?? ""

      if (!isTextContentType(contentType)) {
        return {
          ok: false,
          error: `Tipo de conteúdo não suportado: ${contentType || "desconhecido"}.`,
        }
      }

      const { body: text, truncated } = await readBody(response)

      return {
        ok: response.ok,
        status: response.status,
        url: current.toString(),
        contentType,
        truncated,
        body: text,
      }
    } catch (error) {
      if (controller.signal.aborted) {
        return { ok: false, error: "Tempo limite da requisição excedido." }
      }

      return {
        ok: false,
        error: isRecord(error) && typeof error.message === "string"
          ? error.message
          : "Falha ao executar a requisição.",
      }
    } finally {
      clearTimeout(timeout)
    }
  },
})
