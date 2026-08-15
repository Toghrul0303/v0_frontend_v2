"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  FolderClosed,
  Plus,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MEMORY_FOLDERS, type Chapter } from "./data"
import { STATUS_STYLES, useTaskTracker } from "./task-tracker-context"

const SESSIONS = [
  { id: "s1", name: "Physics · Rotational Motion", active: true },
  { id: "s2", name: "Calculus · Integrals" },
  { id: "s3", name: "Chemistry · Kinetics" },
]

export function LeftSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const { progress } = useTaskTracker()

  return (
    <aside
      className={cn(
        "relative z-20 flex shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-500 ease-out",
        collapsed ? "w-16" : "w-72",
      )}
    >
      {/* Header / session buttons */}
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <span className="font-display text-sm font-semibold text-muted-foreground">
              Workspace
            </span>
          )}
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            {collapsed ? (
              <ChevronsRight className="size-4" aria-hidden="true" />
            ) : (
              <ChevronsLeft className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <button
          type="button"
          className={cn(
            "bg-brand-gradient ring-brand-glow flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-white transition-transform hover:-translate-y-px",
            collapsed && "justify-center px-0",
          )}
        >
          <Plus className="size-4" aria-hidden="true" />
          {!collapsed && "New Session"}
        </button>
      </div>

      {collapsed ? (
        <CollapsedRail progress={progress} />
      ) : (
        <div className="scroll-slim flex-1 space-y-6 overflow-y-auto px-3 pb-4">
          {/* Sessions */}
          <Section title="My Sessions">
            <ul className="space-y-1">
              {SESSIONS.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                      s.active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        s.active ? "bg-primary" : "bg-muted-foreground/40",
                      )}
                    />
                    <span className="truncate">{s.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Section>

          {/* Task tracker */}
          <TaskTracker />

          {/* Memory box */}
          <Section title="Personal Database · Memory Box">
            <div className="grid grid-cols-2 gap-2">
              {MEMORY_FOLDERS.map((folder) => {
                const Icon = folder.icon
                return (
                  <button
                    key={folder.id}
                    type="button"
                    className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-3 text-left transition-all hover:-translate-y-px hover:border-primary/40 hover:shadow-sm"
                  >
                    <span
                      className="grid size-8 place-items-center rounded-lg text-white transition-transform group-hover:scale-105"
                      style={{ backgroundColor: folder.hue }}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="text-[0.8rem] font-semibold">
                      {folder.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {folder.count} items
                    </span>
                  </button>
                )
              })}
            </div>
          </Section>
        </div>
      )}
    </aside>
  )
}

function TaskTracker() {
  const { chapters, progress } = useTaskTracker()

  return (
    <Section title="Task Tracker">
      {/* Progress (based on green items, ignoring skipped) */}
      <div className="rounded-xl border border-border bg-card p-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">
            Session progress
          </span>
          <span className="font-semibold text-primary">{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="bg-brand-gradient h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 px-1 text-[0.65rem] text-muted-foreground">
        {(["completed", "review", "skipped"] as const).map((status) => (
          <span key={status} className="flex items-center gap-1">
            <span className={cn("size-2 rounded-full", STATUS_STYLES[status].dot)} />
            {STATUS_STYLES[status].label}
          </span>
        ))}
      </div>

      {/* Chapters accordion */}
      <div className="mt-2 space-y-2">
        {chapters.map((chapter) => (
          <ChapterAccordion key={chapter.id} chapter={chapter} />
        ))}
      </div>
    </Section>
  )
}

function ChapterAccordion({ chapter }: { chapter: Chapter }) {
  const [open, setOpen] = useState(true)
  const { activeQuestionId, cycleStatus, setActiveQuestionId } = useTaskTracker()

  const done = chapter.questions.filter((q) => q.status === "completed").length

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-sidebar-accent/40"
      >
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
            !open && "-rotate-90",
          )}
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.8rem] font-semibold">
            {chapter.title}
          </span>
          <span className="block text-xs text-muted-foreground">
            {done}/{chapter.questions.length} completed
          </span>
        </span>
      </button>

      {open && (
        <div className="grid grid-cols-5 gap-1.5 px-3 pb-3">
          {chapter.questions.map((q) => {
            const styles = STATUS_STYLES[q.status]
            const isActive = q.id === activeQuestionId
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setActiveQuestionId(q.id)
                  cycleStatus(q.id)
                }}
                title={`${q.label} — ${styles.label} (click to change)`}
                aria-label={`${q.label}, ${styles.label}. Click to change state.`}
                className={cn(
                  "grid h-8 place-items-center rounded-lg border text-xs font-semibold tabular-nums transition-all",
                  styles.pill,
                  isActive && "ring-2 ring-primary ring-offset-1 ring-offset-card",
                )}
              >
                {q.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="mb-2 flex items-center gap-1.5 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}

function CollapsedRail({ progress }: { progress: number }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-4 py-4">
      <button
        type="button"
        aria-label="Sessions"
        className="grid size-9 place-items-center rounded-xl bg-sidebar-accent text-sidebar-accent-foreground"
      >
        <Sparkles className="size-4" aria-hidden="true" />
      </button>
      {MEMORY_FOLDERS.slice(0, 3).map((f) => {
        const Icon = f.icon
        return (
          <button
            key={f.id}
            type="button"
            aria-label={f.name}
            className="grid size-9 place-items-center rounded-xl text-white"
            style={{ backgroundColor: f.hue }}
          >
            <Icon className="size-4" aria-hidden="true" />
          </button>
        )
      })}
      <div className="mt-auto flex flex-col items-center gap-1">
        <div className="grid size-9 place-items-center rounded-xl border border-border text-xs font-semibold text-primary">
          {progress}
        </div>
        <FolderClosed className="size-4 text-muted-foreground" aria-hidden="true" />
      </div>
    </div>
  )
}
