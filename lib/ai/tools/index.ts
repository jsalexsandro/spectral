import type { ToolSet } from "ai"
import { fetchUrlTool } from "./fetch-url"

export function getChatTools(): ToolSet {
  return {
    fetchUrl: fetchUrlTool,
  }
}
