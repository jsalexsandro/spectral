import type { PromptSection } from "../types"
import { capabilitiesSection } from "./capabilities"
import { generativeUiSection } from "./generative-ui"
import { identitySection } from "./identity"
import { safetySection } from "./safety"
import { styleSection } from "./style"
import { userContextSection } from "./user-context"

export const promptSections: readonly PromptSection[] = [
  identitySection,
  styleSection,
  capabilitiesSection,
  generativeUiSection,
  safetySection,
  userContextSection,
]
