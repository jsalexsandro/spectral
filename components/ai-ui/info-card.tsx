import type { InfoCardProps } from "@/lib/ai/ui/catalog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function InfoCard({
  title,
  subtitle,
  description,
  items,
}: InfoCardProps) {
  return (
    <Card size="sm" className="shadow-none">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      {(description || (items && items.length > 0)) && (
        <CardContent className="space-y-3">
          {description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
          {items && items.length > 0 && (
            <dl className="divide-y divide-border/70">
              {items.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="flex items-start justify-between gap-4 py-2 first:pt-0 last:pb-0"
                >
                  <dt className="text-xs text-muted-foreground">{item.label}</dt>
                  <dd className="text-right text-xs font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </CardContent>
      )}
    </Card>
  )
}
