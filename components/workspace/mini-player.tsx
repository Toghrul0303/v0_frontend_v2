"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { GripVertical, Minus, Music, Pause, Play, SkipForward, X } from "lucide-react"
import { cn } from "@/lib/utils"

type PlayerState = "open" | "minimized" | "closed"
type Point = { x: number; y: number }

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

/**
 * Hook that makes an element free-dragging via pointer events.
 * Position is tracked as an offset (in px) from the element's default
 * bottom-left anchor, and clamped to stay within the viewport.
 */
function useDraggable() {
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const origin = useRef<{ pointer: Point; offset: Point } | null>(null)

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Only start dragging with the primary (usually left) button.
      if (e.button !== 0) return
      e.preventDefault()
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      origin.current = { pointer: { x: e.clientX, y: e.clientY }, offset }
      setDragging(true)
    },
    [offset],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!origin.current) return
      const dx = e.clientX - origin.current.pointer.x
      const dy = e.clientY - origin.current.pointer.y
      // Anchored bottom-left: moving up/right increases the offset.
      let nextX = origin.current.offset.x + dx
      let nextY = origin.current.offset.y - dy

      // Clamp within the viewport based on the element's size.
      const el = ref.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const maxX = window.innerWidth - rect.width - 16
        const maxY = window.innerHeight - rect.height - 16
        nextX = Math.min(Math.max(nextX, 0), Math.max(maxX, 0))
        nextY = Math.min(Math.max(nextY, 0), Math.max(maxY, 0))
      }
      setOffset({ x: nextX, y: nextY })
    },
    [],
  )

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    origin.current = null
    setDragging(false)
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      /* pointer may already be released */
    }
  }, [])

  // Keep the player on-screen if the viewport shrinks.
  useEffect(() => {
    const onResize = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const maxX = Math.max(window.innerWidth - rect.width - 16, 0)
      const maxY = Math.max(window.innerHeight - rect.height - 16, 0)
      setOffset((o) => ({
        x: Math.min(o.x, maxX),
        y: Math.min(o.y, maxY),
      }))
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const style: React.CSSProperties = {
    transform: `translate3d(${offset.x}px, ${-offset.y}px, 0)`,
  }

  return {
    ref,
    style,
    dragging,
    handleProps: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  }
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
