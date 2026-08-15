"use client"

import { useState } from "react"
import { GripVertical, Minus, Music, Pause, Play, SkipForward, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDraggable } from "./use-draggable"

type PlayerState = "open" | "minimized" | "closed"

function EqBars({ playing }: { playing: boolean }) {
  if (!playing) return null
  return (
    <span className="absolute inset-0 flex items-end justify-center gap-0.5 bg-black/10 pb-1.5">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-0.5 animate-pulse rounded-full bg-white/80"
          style={{
            height: `${6 + ((i * 5) % 12)}px`,
            animationDelay: `${i * 120}ms`,
          }}
        />
      ))}
    </span>
  )
}

export function MiniPlayer() {
  const [playing, setPlaying] = useState(true)
  const [state, setState] = useState<PlayerState>("open")
  const { ref, style, dragging, handleProps } = useDraggable()

  // Shared drag-handle styling.
  const gripClass = cn(
    "grid shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
    dragging ? "cursor-grabbing" : "cursor-grab",
  )

  // Fully hidden — leave a tiny launcher so it can be brought back.
  if (state === "closed") {
    return (
      <button
        type="button"
        onClick={() => setState("open")}
        aria-label="Open focus music player"
        className="bg-brand-gradient ring-brand-glow fixed bottom-4 left-4 z-[60] grid size-11 place-items-center rounded-full text-white shadow-xl transition-transform hover:scale-105"
      >
        <Music className="size-5" aria-hidden="true" />
      </button>
    )
  }

  // Minimized — tiny pill with a grip, artwork + play/pause.
  if (state === "minimized") {
    return (
      <div
        ref={ref}
        style={style}
        className={cn(
          "fixed bottom-4 left-4 z-[60] flex items-center gap-1.5 rounded-full border border-border bg-popover/90 p-1.5 shadow-xl backdrop-blur-md",
          dragging && "select-none",
        )}
      >
        <span {...handleProps} className={cn(gripClass, "size-7")} aria-label="Drag player">
          <GripVertical className="size-4" aria-hidden="true" />
        </span>
        <button
          type="button"
          onClick={() => setState("open")}
          aria-label="Expand focus music player"
          className="bg-brand-gradient relative grid size-8 place-items-center overflow-hidden rounded-full text-white"
        >
          <Music className="size-4" aria-hidden="true" />
          <EqBars playing={playing} />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause focus music" : "Play focus music"}
          className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {playing ? (
            <Pause className="size-3.5" fill="currentColor" aria-hidden="true" />
          ) : (
            <Play className="size-3.5" fill="currentColor" aria-hidden="true" />
          )}
        </button>
      </div>
    )
  }

  // Full player.
  return (
    <div
      ref={ref}
      style={style}
      className={cn(
        "fixed bottom-4 left-4 z-[60] flex items-center gap-2 rounded-2xl border border-border bg-popover/90 p-2 pr-3 shadow-xl backdrop-blur-md",
        dragging && "select-none shadow-2xl",
      )}
    >
      {/* drag handle */}
      <span
        {...handleProps}
        className={cn(gripClass, "h-11 w-5")}
        aria-label="Drag player"
      >
        <GripVertical className="size-4" aria-hidden="true" />
      </span>

      {/* animated art */}
      <div className="bg-brand-gradient relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl text-white">
        <Music className="size-5" aria-hidden="true" />
        <EqBars playing={playing} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-semibold">Deep Focus · Lo-Fi</p>
        <p className="truncate text-xs text-muted-foreground">
          Study Beats — 2:14 / 58:00
        </p>
        <div className="mt-1 h-1 w-32 overflow-hidden rounded-full bg-secondary">
          <div className="bg-brand-gradient h-full w-[8%] rounded-full" />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause focus music" : "Play focus music"}
          className={cn(
            "grid size-9 place-items-center rounded-full text-white transition-transform hover:scale-105",
            "bg-brand-gradient",
          )}
        >
          {playing ? (
            <Pause className="size-4" fill="currentColor" aria-hidden="true" />
          ) : (
            <Play className="size-4" fill="currentColor" aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          aria-label="Next track"
          className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <SkipForward className="size-4" aria-hidden="true" />
        </button>
      </div>

      {/* window controls */}
      <div className="ml-1 flex flex-col gap-1 border-l border-border pl-2">
        <button
          type="button"
          onClick={() => setState("minimized")}
          aria-label="Minimize player"
          className="grid size-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Minus className="size-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setState("closed")}
          aria-label="Close player"
          className="grid size-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
