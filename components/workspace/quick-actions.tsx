"use client"

import { BookOpen, ListChecks, Lightbulb, type LucideIcon } from "lucide-react"

const ACTIONS: { id: string; icon: LucideIcon; label: string }[] = [
  { id: "summarize", icon: BookOpen, label: "Summarize" },
  { id: "quiz", icon: ListChecks, label: "Make Quiz" },
  { id: "explain", icon: Lightbulb, label: "Explain simply" },
]

export function QuickActions() {
  return (
    <div className="relative z-10 flex shrink-0 flex-col items-center justify-center gap-3 px-2">
      {ACTIONS.map(({ id, icon: Icon, label }) => (
        <div key={id} className="group relative">
          <button
            type="button"
            aria-label={label}
            className="ring-brand-glow grid size-11 place-items-center rounded-2xl border border-border bg-card text-muted-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-brand-gradient hover:text-white"
          >
            <Icon className="size-5" aria-hidden="true" />
          </button>
          <span className="pointer-events-none absolute top-1/2 right-full mr-2 -translate-y-1/2 rounded-lg bg-popover px-2 py-1 text-xs font-medium whitespace-nowrap text-popover-foreground opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
