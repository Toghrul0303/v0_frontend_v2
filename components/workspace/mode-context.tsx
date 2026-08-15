"use client"

import { createContext, useContext } from "react"

type ModeContextValue = {
  focus: boolean
  toggleFocus: () => void
}

export const ModeContext = createContext<ModeContextValue>({
  focus: false,
  toggleFocus: () => {},
})

export function useMode() {
  return useContext(ModeContext)
}
