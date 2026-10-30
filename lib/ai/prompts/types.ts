import type { ProviderId } from "../providers"

export type PromptUser = {
  name?: string | null
  nickname?: string | null
}

export type PromptModel = {
  provider: ProviderId
  modelId: string
}

export type PromptContext = {
  user?: PromptUser
  locale?: string
  now?: Date
  model?: PromptModel
}

export type PromptSection = {
  id: string
  render: (context: PromptContext) => string | null
}
