"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import {
  INITIAL_CHAPTERS,
  type Chapter,
  type Question,
  type QuestionStatus,
} from "./data"

/** Order used when clicking a question pill to cycle its state. */
const STATUS_CYCLE: QuestionStatus[] = [
  "unanswered",
  "completed",
  "review",
  "skipped",
]

type ActiveQuestion = {
  chapterId: string
  chapterTitle: string
  question: Question
}

type TaskTrackerValue = {
  chapters: Chapter[]
  /** Completion % based on green items, ignoring grey (skipped) items. */
  progress: number
  activeQuestionId: string | null
  activeQuestion: ActiveQuestion | null
  setActiveQuestionId: (id: string) => void
  /** Advance a question to its next state in the cycle. */
  cycleStatus: (questionId: string) => void
  /** Set a question directly to a specific state. */
  setStatus: (questionId: string, status: QuestionStatus) => void
}

const TaskTrackerContext = createContext<TaskTrackerValue | null>(null)

export function useTaskTracker() {
  const ctx = useContext(TaskTrackerContext)
  if (!ctx) {
    throw new Error("useTaskTracker must be used within a TaskTrackerProvider")
  }
  return ctx
}

export function TaskTrackerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [chapters, setChapters] = useState<Chapter[]>(INITIAL_CHAPTERS)
  // Default the active question to the first one so the eval bar is available.
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    INITIAL_CHAPTERS[0]?.questions[0]?.id ?? null,
  )

  const setStatus = useCallback(
    (questionId: string, status: QuestionStatus) => {
      setChapters((prev) =>
        prev.map((chapter) => ({
          ...chapter,
          questions: chapter.questions.map((q) =>
            q.id === questionId ? { ...q, status } : q,
          ),
        })),
      )
    },
    [],
  )

  const cycleStatus = useCallback((questionId: string) => {
    setChapters((prev) =>
      prev.map((chapter) => ({
        ...chapter,
        questions: chapter.questions.map((q) => {
          if (q.id !== questionId) return q
          const idx = STATUS_CYCLE.indexOf(q.status)
          const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
          return { ...q, status: next }
        }),
      })),
    )
  }, [])

  const progress = useMemo(() => {
    const all = chapters.flatMap((c) => c.questions)
    // Skipped (grey) items are excluded from the denominator entirely.
    const counted = all.filter((q) => q.status !== "skipped")
    if (counted.length === 0) return 0
    const completed = counted.filter((q) => q.status === "completed").length
    return Math.round((completed / counted.length) * 100)
  }, [chapters])

  const activeQuestion = useMemo<ActiveQuestion | null>(() => {
    if (!activeQuestionId) return null
    for (const chapter of chapters) {
      const question = chapter.questions.find((q) => q.id === activeQuestionId)
      if (question) {
        return { chapterId: chapter.id, chapterTitle: chapter.title, question }
      }
    }
    return null
  }, [activeQuestionId, chapters])

  const value = useMemo<TaskTrackerValue>(
    () => ({
      chapters,
      progress,
      activeQuestionId,
      activeQuestion,
      setActiveQuestionId,
      cycleStatus,
      setStatus,
    }),
    [chapters, progress, activeQuestionId, activeQuestion, cycleStatus, setStatus],
  )

  return (
    <TaskTrackerContext.Provider value={value}>
      {children}
    </TaskTrackerContext.Provider>
  )
}

/** Shared visual tokens for each question status. */
export const STATUS_STYLES: Record<
  QuestionStatus,
  { pill: string; dot: string; label: string }
> = {
  unanswered: {
    pill: "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
    dot: "bg-muted-foreground/40",
    label: "Unanswered",
  },
  completed: {
    pill: "border-transparent bg-emerald-500 text-white shadow-sm",
    dot: "bg-emerald-500",
    label: "Completed",
  },
  review: {
    pill: "border-transparent bg-red-500 text-white shadow-sm",
    dot: "bg-red-500",
    label: "Needs Review",
  },
  skipped: {
    pill: "border-transparent bg-muted-foreground/60 text-white",
    dot: "bg-muted-foreground/60",
    label: "Skipped",
  },
}
