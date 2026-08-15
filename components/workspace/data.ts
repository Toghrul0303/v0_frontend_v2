import type { LucideIcon } from "lucide-react"
import {
  BookMarked,
  FunctionSquare,
  LineChart,
  NotebookPen,
} from "lucide-react"

export type Task = {
  id: string
  label: string
  detail: string
  done: boolean
  flagged: boolean
}

export type QuestionStatus = "unanswered" | "completed" | "review" | "skipped"

export type Question = {
  id: string
  label: string
  status: QuestionStatus
}

export type Chapter = {
  id: string
  title: string
  questions: Question[]
}

export type MemoryFolder = {
  id: string
  name: string
  count: number
  icon: LucideIcon
  hue: string
}

export type ToolMode = {
  id: string
  label: string
  description: string
}

export type ChatSaveTarget = "formula" | "graph" | null

export type ChatMessage = {
  id: string
  role: "user" | "ai"
  content: string
  save?: ChatSaveTarget
  formula?: string
}

export const INITIAL_TASKS: Task[] = [
  {
    id: "t1",
    label: "Chapter 22 · Q2, Q4, Q5",
    detail: "Rotational dynamics — torque problems",
    done: true,
    flagged: false,
  },
  {
    id: "t2",
    label: "Chapter 22 · Q8",
    detail: "Moment of inertia of a compound body",
    done: true,
    flagged: true,
  },
  {
    id: "t3",
    label: "Chapter 23 · Q1, Q3",
    detail: "Angular momentum conservation",
    done: true,
    flagged: false,
  },
  {
    id: "t4",
    label: "Lab Report · Section 4",
    detail: "Error propagation write-up",
    done: false,
    flagged: true,
  },
  {
    id: "t5",
    label: "Chapter 24 · Q6, Q7",
    detail: "Simple harmonic motion",
    done: false,
    flagged: false,
  },
  {
    id: "t6",
    label: "Practice Set · Waves",
    detail: "Standing waves & resonance",
    done: false,
    flagged: false,
  },
]

/** Builds a chapter of exactly 10 questions (Q1…Q10). */
function buildChapter(
  id: string,
  title: string,
  seed: Partial<Record<number, QuestionStatus>> = {},
): Chapter {
  return {
    id,
    title,
    questions: Array.from({ length: 10 }, (_, i) => {
      const n = i + 1
      return {
        id: `${id}-q${n}`,
        label: `Q${n}`,
        status: seed[n] ?? "unanswered",
      }
    }),
  }
}

export const INITIAL_CHAPTERS: Chapter[] = [
  buildChapter("serway-22", "Serway · Chapter 22", {
    1: "completed",
    2: "completed",
    3: "review",
    4: "completed",
    5: "skipped",
  }),
  buildChapter("serway-23", "Serway · Chapter 23", {
    1: "completed",
    2: "review",
  }),
]

export const MEMORY_FOLDERS: MemoryFolder[] = [
  {
    id: "formula",
    name: "FormulaBox",
    count: 24,
    icon: FunctionSquare,
    hue: "var(--brand-red)",
  },
  {
    id: "graphs",
    name: "Graphs",
    count: 11,
    icon: LineChart,
    hue: "var(--brand-purple)",
  },
  {
    id: "summaries",
    name: "Summaries",
    count: 8,
    icon: NotebookPen,
    hue: "var(--brand)",
  },
  {
    id: "bookmarks",
    name: "Bookmarks",
    count: 5,
    icon: BookMarked,
    hue: "var(--brand-red)",
  },
]

export const TOOL_MODES: ToolMode[] = [
  {
    id: "detailed",
    label: "Detailed Explanation",
    description: "Step-by-step walkthrough with reasoning",
  },
  {
    id: "summary",
    label: "Summary & Formulas",
    description: "Condensed notes and the key equations",
  },
  {
    id: "quiz",
    label: "Quiz Mode",
    description: "Generate practice questions to test yourself",
  },
  {
    id: "similar",
    label: "Similar Question Generator",
    description: "Create variations of the current problem",
  },
]

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content: "How do I find the torque on the rotating disc in Chapter 22, Q4?",
  },
  {
    id: "m2",
    role: "ai",
    content:
      "Torque is the rotational analogue of force. For your disc, use the relationship between torque, moment of inertia, and angular acceleration. Substitute the disc's inertia and you can solve directly.",
    save: "formula",
    formula: "\u03C4 = I\u03B1 = \u00BD M R\u00B2 \u03B1",
  },
  {
    id: "m3",
    role: "user",
    content: "Can you plot how torque changes as angular acceleration increases?",
  },
  {
    id: "m4",
    role: "ai",
    content:
      "Here's the linear relationship — torque scales directly with angular acceleration for a fixed moment of inertia. I've plotted it on the Desk so you can annotate it there.",
    save: "graph",
  },
]

export const NAV_TABS = [
  "Desk",
  "Library",
  "Assignments",
  "Notes",
  "Progress",
] as const
