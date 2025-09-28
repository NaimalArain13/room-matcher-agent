"use client"

import { CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export type StepStatus = "idle" | "running" | "done"

export interface StepState {
  label: string
  status: StepStatus
}

interface AgentStepperProps {
  steps: StepState[]
  candidateCount: number
}

export function AgentStepper({ steps, candidateCount }: AgentStepperProps) {
  return (
    <ol className="grid grid-cols-1 sm:grid-cols-4 gap-3">
      {steps.map((s, idx) => (
        <li
          key={s.label}
          className={cn(
            "rounded-md border p-3 flex items-center gap-3",
            s.status === "done" ? "bg-accent/20" : "bg-card",
          )}
        >
          <div className="shrink-0">
            {s.status === "running" ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" aria-label="Running" />
            ) : s.status === "done" ? (
              <CheckCircle2 className="h-5 w-5 text-primary" aria-label="Done" />
            ) : (
              <div className="h-5 w-5 rounded-full border" aria-hidden="true" />
            )}
          </div>
          <div className="space-y-0.5">
            <div className="text-sm font-medium">{s.label}</div>
            <div className="text-xs text-muted-foreground">
              {s.label === "Match Scorer" && s.status !== "idle"
                ? `scoring candidates (${candidateCount || 125} checked)`
                : s.label === "Profile Reader" && s.status !== "idle"
                  ? "extracting fields"
                  : s.label === "Red Flag" && s.status !== "idle"
                    ? "safety and conflicts"
                    : s.label === "Wingman" && s.status !== "idle"
                      ? "drafting advice"
                      : ""}
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
