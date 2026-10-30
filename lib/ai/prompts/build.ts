import { SYSTEM_PROMPT_VERSION } from "./registry"
import { promptSections } from "./sections"
import type { PromptContext } from "./types"

export type BuiltSystemPrompt = {
  prompt: string
  version: number
}

export function buildSystemPrompt(
  context: PromptContext = {},
): BuiltSystemPrompt {
  const prompt = promptSections
    .map((section) => section.render(context))
    .filter((value): value is string => Boolean(value?.trim()))
    .map((value) => value.trim())
    .join("\n\n")

  return { prompt, version: SYSTEM_PROMPT_VERSION }
}
