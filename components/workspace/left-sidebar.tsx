"use client"

import { useMemo, useState } from "react"
import {
  ChevronsLeft,
  ChevronsRight,
  Flag,
  FolderClosed,
  Plus,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { INITIAL_TASKS, MEMORY_FOLDERS, type Task } from "./data"

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
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)

  const progress = useMemo(() => {
    const done = tasks.filter((t) => t.done).length
    return Math.round((done / tasks.length) * 100)
  }, [tasks])

  const toggleTask = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  const toggleFlag = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, flagged: !t.flagged } : t)),
    )

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
          <Section title="Task Tracker">
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

            <ul className="mt-2 space-y-1">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="group flex items-start gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-accent/50"
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={task.done}
                    aria-label={`Mark ${task.label} ${task.done ? "incomplete" : "complete"}`}
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                      "mt-0.5 grid size-4 shrink-0 place-items-center rounded-[5px] border transition-colors",
                      task.done
                        ? "border-transparent bg-primary text-primary-foreground"
                        : "border-muted-foreground/40 hover:border-primary",
                    )}
                  >
                    {task.done && (
                      <svg
                        viewBox="0 0 12 12"
                        className="size-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M2.5 6.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-[0.8rem] leading-tight font-medium",
                        task.done && "text-muted-foreground line-through",
                      )}
                    >
                      {task.label}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {task.detail}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFlag(task.id)}
                    aria-label={task.flagged ? "Unflag question" : "Flag confusing question"}
                    aria-pressed={task.flagged}
                    className={cn(
                      "mt-0.5 shrink-0 rounded-md p-1 transition-colors",
                      task.flagged
                        ? "text-destructive"
                        : "text-muted-foreground/40 opacity-0 group-hover:opacity-100 hover:text-destructive",
                    )}
                  >
                    <Flag
                      className="size-3.5"
                      fill={task.flagged ? "currentColor" : "none"}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </Section>

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
