import { Globe, Loader2, X } from "lucide-react"
import {
  getToolName,
  type DynamicToolUIPart,
  type ToolUIPart,
} from "ai"

function getToolUrl(part: ToolUIPart | DynamicToolUIPart): string | null {
  const input: unknown = part.input

  if (typeof input !== "object" || input === null) {
    return null
  }

  const url = (input as { url?: unknown }).url

  return typeof url === "string" ? url : null
}

function getDisplayHost(url: string): string {
  try {
    return new URL(url).host
  } catch {
    return url
  }
}

export function ToolPartCard({ part }: { part: ToolUIPart | DynamicToolUIPart }) {
  if (getToolName(part) !== "fetchUrl") {
    return null
  }

  const url = getToolUrl(part)
  const host = url ? getDisplayHost(url) : null
  const isError = part.state === "output-error"
  const isPending =
    part.state === "input-streaming" ||
    part.state === "input-available" ||
    part.state === "approval-requested" ||
    part.state === "approval-responded"

  return (
    <div className="flex items-start gap-2 rounded-lg border border-border/70 bg-background/50 px-2.5 py-2 text-xs">
      {isPending ? (
        <Loader2 className="mt-0.5 size-3.5 shrink-0 animate-spin text-muted-foreground" />
      ) : isError ? (
        <X className="mt-0.5 size-3.5 shrink-0 text-destructive" />
      ) : (
        <Globe className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
      )}
      <div className="min-w-0">
        <p className="font-medium">
          {isPending
            ? "Consultando"
            : isError
              ? "Falha ao consultar"
              : "Consultou"}
          {host && (
            <span className="font-normal text-muted-foreground"> {host}</span>
          )}
        </p>
        {isError && part.errorText && (
          <p className="mt-0.5 break-words text-muted-foreground">
            {part.errorText}
          </p>
        )}
      </div>
    </div>
  )
}
