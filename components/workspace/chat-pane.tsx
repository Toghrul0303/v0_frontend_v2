"use client"

import { useEffect, useRef, useState } from "react"
import {
  ArrowUp,
  Check,
  FunctionSquare,
  LineChart,
  Plus,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  INITIAL_MESSAGES,
  TOOL_MODES,
  type ChatMessage,
  type ToolMode,
} from "./data"

export function ChatPane() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState("")
  const [toolOpen, setToolOpen] = useState(false)
  const [activeTool, setActiveTool] = useState<ToolMode>(TOOL_MODES[0])
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const scrollRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages])

  useEffect(() => {
    if (!toolOpen) return
    const onClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setToolOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [toolOpen])

  const send = () => {
    const text = input.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: text },
      {
        id: crypto.randomUUID(),
        role: "ai",
        content: `Using ${activeTool.label} — here's a response to "${text}". I've added the relevant working to your Desk.`,
      },
    ])
    setInput("")
  }

  return (
    <aside
      aria-label="AI tutor chat"
      className="flex w-[24rem] max-w-full shrink-0 flex-col border-l border-border bg-card/40"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
        <span className="bg-brand-gradient ring-brand-glow grid size-8 place-items-center rounded-lg text-white">
          <Sparkles className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-sm font-semibold">Lumen Tutor</h2>
          <p className="truncate text-xs text-muted-foreground">
            {activeTool.label} · always on the Desk
          </p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Online
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="scroll-slim flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            saved={!!saved[m.id]}
            onSave={() => setSaved((s) => ({ ...s, [m.id]: true }))}
          />
        ))}
      </div>

      {/* Input bar */}
      <div className="border-t border-border p-3">
        <div className="relative flex items-end gap-2 rounded-2xl border border-border bg-background p-2 focus-within:border-primary/50">
          {/* + tools button + popover */}
          <div ref={popoverRef} className="relative">
            <button
              type="button"
              aria-label="Open tool modes"
              aria-expanded={toolOpen}
              onClick={() => setToolOpen((o) => !o)}
              className={cn(
                "grid size-9 place-items-center rounded-xl transition-colors",
                toolOpen
                  ? "bg-brand-gradient text-white"
                  : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Plus
                className={cn(
                  "size-5 transition-transform duration-300",
                  toolOpen && "rotate-45",
                )}
                aria-hidden="true"
              />
            </button>

            {toolOpen && (
              <div className="absolute bottom-full left-0 z-40 mb-2 w-64 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-xl">
                <p className="px-2.5 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Tool modes
                </p>
                {TOOL_MODES.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      setActiveTool(tool)
                      setToolOpen(false)
                    }}
                    className={cn(
                      "flex w-full items-start gap-2 rounded-xl px-2.5 py-2 text-left transition-colors",
                      activeTool.id === tool.id
                        ? "bg-accent"
                        : "hover:bg-accent/60",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">
                        {tool.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {tool.description}
                      </span>
                    </span>
                    {activeTool.id === tool.id && (
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing &&
                e.keyCode !== 229
              ) {
                e.preventDefault()
                send()
              }
            }}
            rows={1}
            placeholder="Ask about this problem…"
            className="max-h-32 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
          />

          <button
            type="button"
            onClick={send}
            disabled={!input.trim()}
            aria-label="Send message"
            className="bg-brand-gradient grid size-9 shrink-0 place-items-center rounded-xl text-white transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="size-5" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-1.5 px-1 text-center text-xs text-muted-foreground">
          Mode: <span className="font-medium text-foreground">{activeTool.label}</span>
        </p>
      </div>
    </aside>
  )
}

function MessageBubble({
  message,
  saved,
  onSave,
}: {
  message: ChatMessage
  saved: boolean
  onSave: () => void
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-brand-gradient max-w-[85%] rounded-2xl rounded-br-md px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-sm">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border border-border bg-card text-primary">
        <Sparkles className="size-3.5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="rounded-2xl rounded-tl-md border border-border bg-card px-3.5 py-2.5 text-sm leading-relaxed text-card-foreground shadow-sm">
          <p>{message.content}</p>

          {message.formula && (
            <div className="mt-2.5 rounded-xl bg-secondary/70 px-3 py-2 text-center font-mono text-base font-medium text-foreground">
              {message.formula}
            </div>
          )}
        </div>

        {message.save && (
          <button
            type="button"
            onClick={onSave}
            disabled={saved}
            className={cn(
              "mt-1.5 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
              saved
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {saved ? (
              <Check className="size-3.5" aria-hidden="true" />
            ) : message.save === "formula" ? (
              <FunctionSquare className="size-3.5" aria-hidden="true" />
            ) : (
              <LineChart className="size-3.5" aria-hidden="true" />
            )}
            {saved
              ? "Saved"
              : message.save === "formula"
                ? "Save to FormulaBox"
                : "Save to GraphBox"}
          </button>
        )}
      </div>
    </div>
  )
}
