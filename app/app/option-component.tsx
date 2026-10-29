"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type OptionComponentProps = {
  icon: LucideIcon
  label: string
  active?: boolean
  collapsed?: boolean
  onClick?: () => void
}

export function OptionComponent({
  icon: Icon,
  label,
  active = false,
  collapsed = false,
  onClick,
}: OptionComponentProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring",
        active
          ? "bg-accent font-medium text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className={cn("truncate", collapsed && "sr-only")}>{label}</span>
    </button>
  )
}
