"use client"

import { useState } from "react"
import { Calculator, FileText, Layers, NotebookPen, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { GraphWidget } from "./graph-widget"
import { CalculatorKeypad } from "./calculator-keypad"

const DOCS = [
  { id: "d1", name: "Ch.22 Worksheet" },
  { id: "d2", name: "Torque Notes" },
  { id: "d3", name: "Lab Report" },
]

type Drawer = "calculator" | "notes" | null

const DOCK = [
  { id: "calculator" as const, label: "Calculator", icon: Calculator },
  { id: "notes" as const, label: "Notes", icon: NotebookPen },
]

export function Desk() {
  const [activeDoc, setActiveDoc] = useState(DOCS[0].id)
  const [drawer, setDrawer] = useState<Drawer>(null)

  const toggleDrawer = (d: Exclude<Drawer, null>) =>
    setDrawer((prev) => (prev === d ? null : d))

  return (
    <section
      aria-label="Workspace desk"
      className="relative flex min-w-0 flex-1 flex-col overflow-hidden"
    >
      {/* Desk tab strip */}
      <div className="flex items-center gap-1 border-b border-border px-3 py-2">
        <span className="mr-1 grid size-7 place-items-center rounded-lg bg-accent text-accent-foreground">
          <Layers className="size-4" aria-hidden="true" />
        </span>
        {DOCS.map((doc) => (
          <button
            key={doc.id}
            type="button"
            onClick={() => setActiveDoc(doc.id)}
            className={cn(
              "group flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors",
              activeDoc === doc.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
            )}
          >
            <FileText className="size-3.5" aria-hidden="true" />
            {doc.name}
            {activeDoc === doc.id && (
              <X className="size-3.5 text-muted-foreground/60 transition-colors hover:text-foreground" aria-hidden="true" />
            )}
          </button>
        ))}
        <button
          type="button"
          aria-label="New document"
          className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>

      {/* Whiteboard canvas — free-form, maximized */}
      <div
        className="relative min-h-0 flex-1 overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklab, var(--muted-foreground) 22%, transparent) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          backgroundPosition: "-1px -1px",
        }}
      >
        <div className="scroll-slim flex h-full flex-col gap-4 overflow-y-auto p-5 pb-24">
          <header className="flex flex-col gap-1">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Active problem
            </span>
            <h2 className="font-display text-xl font-semibold text-balance">
              Chapter 22 · Q4 — Torque on a rotating disc
            </h2>
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground text-pretty">
              A uniform disc of mass{" "}
              <span className="font-medium text-foreground">M</span> and radius{" "}
              <span className="font-medium text-foreground">R</span> is driven
              by a motor. Determine the applied torque needed to reach an
              angular acceleration of{" "}
              <span className="font-medium text-foreground">α</span>. Plot,
              annotate and calculate freely on the board.
            </p>
          </header>

          {/* The graph now owns the majority of the board */}
          <div className="min-h-[320px] flex-1">
            <GraphWidget fill />
          </div>
        </div>

        {/* macOS-style bottom tool dock */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center">
          <div className="pointer-events-auto flex items-end gap-2 rounded-2xl border border-border bg-popover/85 p-2 shadow-xl backdrop-blur-md">
            {DOCK.map((tool) => {
              const Icon = tool.icon
              const active = drawer === tool.id
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => toggleDrawer(tool.id)}
                  aria-pressed={active}
                  aria-label={`${active ? "Hide" : "Show"} ${tool.label}`}
                  className={cn(
                    "group flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-200 hover:-translate-y-1",
                    active
                      ? "bg-brand-gradient text-white shadow-md"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  <span className="text-[10px] font-medium">{tool.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Slide-up bottom sheet (drawer) */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-30 transform-gpu transition-transform duration-500 ease-in-out",
            drawer ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="mx-auto max-w-2xl rounded-t-3xl border border-b-0 border-border bg-popover/95 p-4 pb-5 shadow-2xl backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="mx-auto h-1 w-10 rounded-full bg-muted-foreground/30" />
              </div>
              <button
                type="button"
                onClick={() => setDrawer(null)}
                aria-label="Close panel"
                className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {drawer === "calculator" && <CalculatorKeypad />}
            {drawer === "notes" && <NotesPanel />}
          </div>
        </div>
      </div>
    </section>
  )
}

function NotesPanel() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="bg-brand-gradient grid size-8 place-items-center rounded-lg text-white">
          <NotebookPen className="size-4" aria-hidden="true" />
        </span>
        <h3 className="font-display text-sm font-semibold">Working Notes</h3>
      </div>
      <div className="rounded-xl bg-secondary/50 p-3 font-mono text-sm leading-relaxed text-foreground">
        <p>{"I_disc = ½ M R²"}</p>
        <p>{"τ = I α"}</p>
        <p className="text-primary">{"→ τ = ½ M R² α"}</p>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Substitute the disc&apos;s moment of inertia into the torque equation.
        The result scales linearly with α — matching the plot on the board.
      </p>
      <div className="flex flex-wrap gap-2">
        {["M = 2.5 kg", "R = 0.30 m", "α = 4.0 rad/s²"].map((v) => (
          <span
            key={v}
            className="rounded-full border border-border bg-background px-2.5 py-1 font-mono text-xs text-muted-foreground"
          >
            {v}
          </span>
        ))}
      </div>
    </div>
  )
}
