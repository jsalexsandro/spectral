import type { StatGridProps } from "@/lib/ai/ui/catalog"
import { cn } from "@/lib/utils"

export function StatGrid({ title, stats }: StatGridProps) {
  return (
    <div className="space-y-3">
      {title && (
        <p className="text-sm font-medium text-foreground">{title}</p>
      )}
      <dl
        className={cn(
          "grid gap-2",
          stats.length === 2 && "grid-cols-2",
          stats.length > 2 && "grid-cols-2 sm:grid-cols-3",
        )}
      >
        {stats.map((stat, index) => (
          <div
            key={`${stat.label}-${index}`}
            className="rounded-xl border border-border/70 bg-card p-3"
          >
            <dt className="text-xs text-muted-foreground">{stat.label}</dt>
            <dd className="mt-1 font-heading text-xl font-semibold tabular-nums">
              {stat.value}
            </dd>
            {stat.hint && (
              <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
            )}
          </div>
        ))}
      </dl>
    </div>
  )
}
