import type { ToolSet } from "ai"
import { RENDER_UI_TOOL_NAME } from "@/lib/ai/ui/catalog"
import { fetchUrlTool } from "./fetch-url"
import { renderUiTool } from "./render-ui"

export function getChatTools(): ToolSet {
  return {
    fetchUrl: fetchUrlTool,
    [RENDER_UI_TOOL_NAME]: renderUiTool,
  }
}
