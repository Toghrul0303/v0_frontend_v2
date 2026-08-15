"use client"

import { useCallback, useState } from "react"
import { cn } from "@/lib/utils"
import { ModeContext } from "./mode-context"
import { TopNavbar } from "./top-navbar"
import { LeftSidebar } from "./left-sidebar"
import { Desk } from "./desk"
import { QuickActions } from "./quick-actions"
import { ChatPane } from "./chat-pane"
import { MiniPlayer } from "./mini-player"

export function Workspace() {
  const [focus, setFocus] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleFocus = useCallback(() => {
    setFocus((prev) => {
      const next = !prev
      // In Focus Mode, collapse the sidebar so Desk + Chat get maximum space.
      setSidebarCollapsed(next)
      return next
    })
  }, [])

  return (
    <ModeContext.Provider value={{ focus, toggleFocus }}>
      <div
        className={cn(
          "h-dvh w-full overflow-hidden transition-colors duration-700",
          focus && "dark",
        )}
      >
        <div
          className={cn(
            "relative flex h-full flex-col bg-background text-foreground transition-all duration-700",
            focus && "p-0",
          )}
        >
          {/* subtle academic background wash */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 transition-opacity duration-700",
              focus ? "opacity-30" : "opacity-100",
            )}
            style={{
              backgroundImage:
                "radial-gradient(60rem 40rem at 85% -10%, color-mix(in oklab, var(--brand-purple) 14%, transparent), transparent), radial-gradient(50rem 40rem at -10% 110%, color-mix(in oklab, var(--brand-red) 12%, transparent), transparent)",
            }}
          />

          <div className="relative z-10 flex h-full flex-col">
            <TopNavbar />

            <div className="flex min-h-0 flex-1">
              <LeftSidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed((c) => !c)}
              />

              <main className="flex min-w-0 flex-1">
                <Desk />
                <QuickActions />
                <ChatPane />
              </main>
            </div>
          </div>

          <MiniPlayer />
        </div>
      </div>
    </ModeContext.Provider>
  )
}
