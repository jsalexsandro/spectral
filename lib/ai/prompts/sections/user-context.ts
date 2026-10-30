import type { PromptSection } from "../types"

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeZone: "America/Sao_Paulo",
})

export const userContextSection: PromptSection = {
  id: "user-context",
  render: ({ user, locale, now }) => {
    const preferredName = user?.nickname?.trim() || user?.name?.trim()
    const language = locale?.trim() || "pt-BR"
    const lines: string[] = []

    if (preferredName) {
      lines.push(
        `O usuário se chama ${preferredName}. Use o nome com moderação, apenas quando soar natural; não o repita em toda mensagem.`,
      )
    }

    lines.push(`Idioma padrão quando o pedido for ambíguo: ${language}.`)

    if (now) {
      lines.push(`Data atual: ${dateFormatter.format(now)}.`)
    }

    return `## Contexto do usuário\n${lines.map((line) => `- ${line}`).join("\n")}`
  },
}
