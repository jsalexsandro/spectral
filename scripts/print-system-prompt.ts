import {
  buildSystemPrompt,
  SYSTEM_PROMPT_VERSION,
  systemPromptChangelog,
  type PromptContext,
} from "../lib/ai/prompts"

const now = new Date("2026-10-30T12:00:00Z")

const samples: { label: string; context: PromptContext }[] = [
  { label: "Anônimo", context: { now } },
  {
    label: "Com nome",
    context: { user: { name: "Ana Souza" }, now },
  },
  {
    label: "Com apelido",
    context: {
      user: { name: "Ana Souza", nickname: "Aninha" },
      now,
      model: { provider: "openrouter", modelId: "nvidia/nemotron" },
    },
  },
]

console.log(`System prompt v${SYSTEM_PROMPT_VERSION}`)
console.log(systemPromptChangelog)
console.log()

for (const sample of samples) {
  const { prompt } = buildSystemPrompt(sample.context)
  console.log(`===== ${sample.label} =====`)
  console.log(prompt)
  console.log()
}
