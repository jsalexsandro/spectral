import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  type LucideIcon,
} from "lucide-react"
import type { CalloutProps } from "@/lib/ai/ui/catalog"
import { cn } from "@/lib/utils"

type ToneStyle = {
  container: string
  icon: LucideIcon
  iconClassName: string
  titleClassName: string
  bodyClassName: string
}

const toneStyles: Record<CalloutProps["tone"], ToneStyle> = {
  info: {
    container: "border-primary/25 bg-primary/5",
    icon: Info,
    iconClassName: "text-primary",
    titleClassName: "text-foreground",
    bodyClassName: "text-foreground/80",
  },
  success: {
    container: "border-emerald-600/25 bg-emerald-500/10",
    icon: CheckCircle2,
    iconClassName: "text-emerald-700 dark:text-emerald-400",
    titleClassName: "text-foreground",
    bodyClassName: "text-foreground/80",
  },
  warning: {
    container: "border-amber-500/30 bg-amber-500/10",
    icon: AlertTriangle,
    iconClassName: "text-amber-700 dark:text-amber-400",
    titleClassName: "text-foreground",
    bodyClassName: "text-foreground/80",
  },
  danger: {
    container: "border-destructive/30 bg-destructive/5",
    icon: XCircle,
    iconClassName: "text-destructive",
    titleClassName: "text-destructive",
    bodyClassName: "text-foreground/80",
  },
}

export function Callout({ tone = "info", title, body }: CalloutProps) {
  const style = toneStyles[tone]
  const Icon = style.icon

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4",
        style.container,
      )}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", style.iconClassName)} />
      <div className="min-w-0 space-y-1">
        {title && (
          <p className={cn("text-sm font-medium", style.titleClassName)}>
            {title}
          </p>
        )}
        <p className={cn("text-sm leading-relaxed", style.bodyClassName)}>
          {body}
        </p>
      </div>
    </div>
  )
}
