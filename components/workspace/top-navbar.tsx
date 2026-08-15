"use client"

import { useState } from "react"
import { GraduationCap, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { NAV_TABS } from "./data"
import { useMode } from "./mode-context"

function Logo({ focus }: { focus?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 transition-all duration-500 ease-in-out">
      <span
        className={cn(
          "bg-brand-gradient ring-brand-glow grid place-items-center rounded-xl text-white transition-all duration-500 ease-in-out",
          focus ? "size-10" : "size-9",
        )}
      >
        <GraduationCap
          className={cn("transition-all duration-500 ease-in-out", focus ? "size-6" : "size-5")}
          aria-hidden="true"
        />
      </span>
      <span
        className={cn(
          "font-display font-semibold tracking-tight transition-all duration-500 ease-in-out",
          focus ? "text-xl" : "text-lg",
        )}
      >
        <span className="text-brand-gradient">Lumen</span>
      </span>
    </div>
  )
}

function Tabs({ vertical }: { vertical?: boolean }) {
  const [active, setActive] = useState<string>(NAV_TABS[0])
  return (
    <nav
      aria-label="Workspace sections"
      className={cn(
        "flex items-center gap-1",
        vertical && "flex-col items-stretch gap-0.5",
      )}
    >
      {NAV_TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => setActive(tab)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            vertical && "text-left",
            active === tab
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
          )}
        >
          {tab}
        </button>
      ))}
    </nav>
  )
}

function ModeToggle() {
  const { focus, toggleFocus } = useMode()
  return (
    <button
      type="button"
      onClick={toggleFocus}
      aria-pressed={focus}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-border bg-card px-1 py-1 pr-3 text-sm font-medium shadow-sm transition-colors hover:border-primary/40",
      )}
    >
      <span
        className={cn(
          "grid size-6 place-items-center rounded-full transition-all duration-500",
          focus
            ? "bg-brand-gradient text-white"
            : "bg-secondary text-muted-foreground",
        )}
      >
        {focus ? (
          <Moon className="size-3.5" aria-hidden="true" />
        ) : (
          <Sun className="size-3.5" aria-hidden="true" />
        )}
      </span>
      <span className="hidden md:inline">
        {focus ? "Focus Mode" : "Normal Mode"}
      </span>
    </button>
  )
}

export function TopNavbar() {
  const { focus } = useMode()

  return (
    <header
      className={cn(
        "relative z-30 flex shrink-0 items-center px-4 transition-all duration-500 ease-in-out",
        focus ? "h-14" : "h-16 border-b border-border",
      )}
    >
      {/* Left tabs — fade + collapse away in focus mode */}
      <div
        className={cn(
          "flex items-center overflow-hidden transition-all duration-500 ease-in-out",
          focus ? "pointer-events-none w-0 -translate-x-4 opacity-0" : "w-auto translate-x-0 opacity-100",
        )}
      >
        <Tabs />
      </div>

      {/* Center logo — absolutely centered in BOTH modes so it glides, never teleports */}
      <div
        className={cn(
          "group/logo absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-all duration-500 ease-in-out",
          focus ? "cursor-pointer" : "",
        )}
      >
        <Logo focus={focus} />

        {/* Hover-reveal panel (focus mode only) */}
        {focus && (
          <div
            className={cn(
              "absolute top-full left-1/2 mt-3 w-56 -translate-x-1/2 rounded-2xl border border-border bg-popover/95 p-2 opacity-0 shadow-xl backdrop-blur-md",
              "pointer-events-none translate-y-1 transition-all duration-300",
              "group-hover/logo:pointer-events-auto group-hover/logo:translate-y-0 group-hover/logo:opacity-100",
            )}
          >
            <p className="px-3 pt-1 pb-2 text-xs font-medium text-muted-foreground">
              Sections
            </p>
            <Tabs vertical />
          </div>
        )}
      </div>

      {/* Right controls — pushed to the far right */}
      <div className="ml-auto flex items-center gap-2 transition-all duration-500">
        <ModeToggle />
      </div>
    </header>
  )
}
