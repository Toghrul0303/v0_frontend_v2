"use client"

import { useState } from "react"
import { Atom, Calculator, Check, Delete, FlaskConical, Sigma } from "lucide-react"
import { cn } from "@/lib/utils"

type SubjectId = "standard" | "math" | "physics" | "chemistry"

type Subject = {
  id: SubjectId
  name: string
  icon: typeof Atom
  /** Dynamic quick-access symbol keys for this subject. */
  symbols: string[]
}

const SUBJECTS: Subject[] = [
  { id: "standard", name: "Standard", icon: Calculator, symbols: ["MC", "MR", "M+", "M-"] },
  { id: "math", name: "Mathematics", icon: Sigma, symbols: ["∫", "∑", "∞", "√", "∂", "∇", "≈", "≠"] },
  { id: "physics", name: "Physics", icon: Atom, symbols: ["ρ", "α", "φ", "ε", "ω", "τ", "λ", "μ"] },
  { id: "chemistry", name: "Chemistry", icon: FlaskConical, symbols: ["Δ", "°C", "⇌", "N_A", "pH", "e-"] },
]

type Key = { label: string; kind?: "op" }

const NUM_KEYS: Key[] = [
  { label: "7" },
  { label: "8" },
  { label: "9" },
  { label: "÷", kind: "op" },
  { label: "4" },
  { label: "5" },
  { label: "6" },
  { label: "×", kind: "op" },
  { label: "1" },
  { label: "2" },
  { label: "3" },
  { label: "−", kind: "op" },
  { label: "0" },
  { label: "." },
  { label: "x²" },
  { label: "+", kind: "op" },
]

export function CalculatorKeypad() {
  const [expr, setExpr] = useState("½MR²α")
  const [subjectId, setSubjectId] = useState<SubjectId>("physics")
  const [pickerOpen, setPickerOpen] = useState(false)

  const subject = SUBJECTS.find((s) => s.id === subjectId) ?? SUBJECTS[0]
  const SubjectIcon = subject.icon

  const append = (value: string) =>
    setExpr((prev) => (prev === "½MR²α" ? value : prev + value))

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="bg-brand-gradient grid size-8 place-items-center rounded-lg text-white">
          <Calculator className="size-4" aria-hidden="true" />
        </span>
        <h3 className="font-display text-sm font-semibold">Scientific Keypad</h3>
        <span className="ml-auto text-xs font-medium text-muted-foreground">
          {subject.name}
        </span>
      </div>

      {/* display */}
      <div className="mb-3 flex items-center justify-between gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-3">
        <span className="truncate font-mono text-lg font-medium text-foreground">
          {expr || "0"}
        </span>
        <button
          type="button"
          aria-label="Backspace"
          onClick={() => setExpr((p) => p.slice(0, -1))}
          className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Delete className="size-4" aria-hidden="true" />
        </button>
      </div>

      {/* Subject toggle + dynamic symbol keys */}
      <div className="relative mb-1.5 flex items-center gap-1.5">
        {/* Subject toggle circle */}
        <button
          type="button"
          onClick={() => setPickerOpen((o) => !o)}
          aria-label={`Active subject: ${subject.name}. Change subject`}
          aria-expanded={pickerOpen}
          className={cn(
            "bg-brand-gradient ring-brand-glow relative grid size-9 shrink-0 place-items-center rounded-full text-white transition-transform hover:scale-105",
            pickerOpen && "scale-105",
          )}
        >
          <SubjectIcon className="size-4" aria-hidden="true" />
        </button>

        {/* Dynamic symbols for the active subject */}
        <div className="grid flex-1 grid-cols-4 gap-1.5">
          {subject.symbols.map((sym) => (
            <button
              key={sym}
              type="button"
              onClick={() => append(sym)}
              className="h-9 rounded-lg border border-primary/20 bg-primary/10 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              {sym}
            </button>
          ))}
        </div>

        {/* Subject picker popover */}
        {pickerOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              aria-hidden="true"
              onClick={() => setPickerOpen(false)}
            />
            <div className="absolute bottom-full left-0 z-20 mb-2 w-52 rounded-2xl border border-border bg-popover/95 p-1.5 shadow-xl backdrop-blur-md">
              <p className="px-2.5 pt-1 pb-1.5 text-xs font-medium text-muted-foreground">
                Subject symbols
              </p>
              {SUBJECTS.map((s) => {
                const Icon = s.icon
                const active = s.id === subjectId
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSubjectId(s.id)
                      setPickerOpen(false)
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                      active
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-accent/60",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-lg",
                        active ? "bg-brand-gradient text-white" : "bg-secondary text-muted-foreground",
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="flex-1 font-medium">{s.name}</span>
                    <span className="max-w-[5rem] truncate font-mono text-xs text-muted-foreground">
                      {s.symbols.slice(0, 4).join(" ")}
                    </span>
                    {active && <Check className="size-4 text-primary" aria-hidden="true" />}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Controls + numeric grid */}
      <div className="grid grid-cols-4 gap-1.5">
        <button
          type="button"
          onClick={() => setExpr("")}
          className="col-span-2 h-9 rounded-lg border border-destructive/30 bg-destructive/10 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={() => append("(")}
          className="h-9 rounded-lg bg-secondary text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
        >
          ( )
        </button>
        <button
          type="button"
          className="bg-brand-gradient h-9 rounded-lg text-sm font-semibold text-white transition-transform hover:-translate-y-px"
        >
          =
        </button>

        {NUM_KEYS.map((k) => (
          <button
            key={k.label}
            type="button"
            onClick={() => append(k.label)}
            className={cn(
              "h-9 rounded-lg text-sm font-medium transition-colors",
              k.kind === "op"
                ? "bg-secondary font-semibold text-secondary-foreground hover:bg-accent"
                : "bg-muted text-foreground hover:bg-accent",
            )}
          >
            {k.label}
          </button>
        ))}
      </div>
    </div>
  )
}
