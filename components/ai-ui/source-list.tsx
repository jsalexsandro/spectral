import { ExternalLink } from "lucide-react"
import type { SourceListProps } from "@/lib/ai/ui/catalog"

function getHost(url: string): string {
  try {
    return new URL(url).host
  } catch {
    return url
  }
}

export function SourceList({ title, sources }: SourceListProps) {
  return (
    <div className="space-y-2">
      {title && (
        <p className="text-sm font-medium text-foreground">{title}</p>
      )}
      <ul className="space-y-2">
        {sources.map((source, index) => (
          <li
            key={`${source.url}-${index}`}
            className="rounded-xl border border-border/70 bg-card p-3"
          >
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-start gap-1.5 text-sm font-medium text-primary"
            >
              <span className="break-words">{source.title}</span>
              <ExternalLink className="mt-0.5 size-3 shrink-0 transition-transform group-hover:-translate-y-0.5" />
            </a>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              {getHost(source.url)}
            </p>
            {source.snippet && (
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {source.snippet}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
