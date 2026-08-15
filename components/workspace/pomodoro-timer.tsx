"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  ChevronDown,
  GripVertical,
  Pause,
  Play,
  RotateCcw,
  Timer,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useDraggable } from "./use-draggable"

type ModeId = "focus" | "short" | "long"

const MODES: { id: ModeId; label: string; short: string; minutes: number }[] = [
  { id: "focus", label: "Focus", short: "Focus", minutes: 25 },
  { id: "short", label: "Short Break", short: "Short", minutes: 5 },
  { id: "long", label: "Long Break", short: "Long", minutes: 15 },
]

function format(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function PomodoroTimer() {
  const [expanded, setExpanded] = useState(true)
  const [mode, setMode] = useState<ModeId>("focus")
  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(MODES[0].minutes * 60)
  const { ref, style, dragging, handleProps } = useDraggable()

  const activeMode = useMemo(
    () => MODES.find((m) => m.id === mode) ?? MODES[0],
    [mode],
  )

  // Countdown tick.
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  const selectMode = (id: ModeId) => {
    const next = MODES.find((m) => m.id === id) ?? MODES[0]
    setMode(id)
    setRemaining(next.minutes * 60)
    setRunning(false)
  }

  const reset = () => {
    setRemaining(activeMode.minutes * 60)
    setRunning(false)
  }

  const total = activeMode.minutes * 60
  const pct = total > 0 ? ((total - remaining) / total) * 100 : 0

  const gripClass = cn(
    "grid shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
    dragging ? "cursor-grabbing" : "cursor-grab",
  )

  // Collapsed — compact pill: grip, countdown, play/pause.
  if (!expanded) {
    return (
      <div
        ref={ref}
        style={style}
        className={cn(
          "fixed top-20 right-4 z-[70] flex items-center gap-1.5 rounded-full border border-border bg-popover/90 p-1.5 shadow-xl backdrop-blur-md",
          dragging && "select-none",
        )}
      >
        <span {...handleProps} className={cn(gripClass, "size-7")} aria-label="Drag timer">
          <GripVertical className="size-4" aria-hidden="true" />
        </span>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="Expand Pomodoro timer"
          className="flex items-center gap-1.5 rounded-full px-1 text-sm font-semibold tabular-nums transition-colors hover:text-primary"
        >
          <Timer className="size-3.5 text-primary" aria-hidden="true" />
          {format(remaining)}
        </button>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          aria-label={running ? "Pause timer" : "Start timer"}
          className="bg-brand-gradient grid size-8 place-items-center rounded-full text-white transition-transform hover:scale-105"
        >
          {running ? (
            <Pause className="size-3.5" fill="currentColor" aria-hidden="true" />
          ) : (
            <Play className="size-3.5" fill="currentColor" aria-hidden="true" />
          )}
        </button>
      </div>
    )
  }

  // Expanded — full controls.
  return (
    <div
      ref={ref}
      style={style}
      className={cn(
        "fixed top-20 right-4 z-[70] w-64 rounded-2xl border border-border bg-popover/95 shadow-2xl backdrop-blur-md",
        dragging && "select-none",
      )}
    >
      {/* header / drag handle */}
      <div className="flex items-center gap-1.5 border-b border-border px-2 py-2">
        <span {...handleProps} className={cn(gripClass, "h-7 w-6")} aria-label="Drag timer">
          <GripVertical className="size-4" aria-hidden="true" />
        </span>
        <span className="flex items-center gap-1.5 text-sm font-semibold">
          <Timer className="size-4 text-primary" aria-hidden="true" />
          Pomodoro
        </span>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          aria-label="Collapse Pomodoro timer"
          className="ml-auto grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ChevronDown className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="p-3">
        {/* mode switcher */}
        <div className="mb-3 grid grid-cols-3 gap-1 rounded-xl bg-secondary p-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => selectMode(m.id)}
              className={cn(
                "rounded-lg px-1 py-1.5 text-xs font-semibold transition-colors",
                mode === m.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m.short}
            </button>
          ))}
        </div>

        {/* countdown */}
        <div className="text-center">
          <p className="font-display text-5xl font-bold tabular-nums tracking-tight">
            {format(remaining)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {activeMode.label} · {activeMode.minutes} min
          </p>
        </div>

        {/* progress */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="bg-brand-gradient h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* controls */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            aria-label={running ? "Pause timer" : "Start timer"}
            className="bg-brand-gradient ring-brand-glow flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl text-sm font-semibold text-white transition-transform hover:-translate-y-px"
          >
            {running ? (
              <>
                <Pause className="size-4" fill="currentColor" aria-hidden="true" />
                Pause
              </>
            ) : (
              <>
                <Play className="size-4" fill="currentColor" aria-hidden="true" />
                Start
              </>
            )}
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="Reset timer"
            className="grid size-10 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
