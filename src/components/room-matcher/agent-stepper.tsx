import { useEffect, useRef } from "react"
import { CheckCircle2, Loader2, Sparkles } from "lucide-react"
import gsap from "gsap"
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
  const stepsRef = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    steps.forEach((step, index) => {
      const element = stepsRef.current[index]
      if (!element) return

      if (step.status === "running") {
        gsap.fromTo(
          element,
          { scale: 0.95, opacity: 0.7 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out"
          }
        )

        // Pulse animation for running state
        gsap.to(element, {
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
          duration: 0.8,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut"
        })
      } else if (step.status === "done") {
        gsap.killTweensOf(element)
        gsap.to(element, {
          scale: 1,
          opacity: 1,
          boxShadow: "0 0 0px rgba(59, 130, 246, 0)",
          duration: 0.3
        })

        // Success pop animation
        const icon = element.querySelector(".step-icon")
        if (icon) {
          gsap.fromTo(
            icon,
            { scale: 0, rotation: -180 },
            {
              scale: 1,
              rotation: 0,
              duration: 0.5,
              ease: "back.out(1.7)"
            }
          )
        }
      }
    })
  }, [steps])

  return (
    <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {steps.map((s, idx) => (
        <li
          key={s.label}
          ref={(el) => { stepsRef.current[idx] = el; }}
          className={cn(
            "rounded-xl border-2 p-4 flex items-center gap-4 transition-all duration-300 relative overflow-hidden",
            s.status === "done"
              ? "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-blue-300 dark:border-blue-700"
              : s.status === "running"
                ? "bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 border-blue-400 dark:border-blue-600"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
          )}
        >
          {/* Animated background gradient for active state */}
          {s.status === "running" && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-blue-400/20 animate-gradient" />
          )}

          <div className="shrink-0 relative z-10">
            {s.status === "running" ? (
              <div className="relative">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" aria-label="Running" />
                <div className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping" />
              </div>
            ) : s.status === "done" ? (
              <div className="step-icon w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="h-5 w-5 text-white" aria-label="Done" />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center" aria-hidden="true">
                <div className="h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
            )}
          </div>

          <div className="space-y-1 relative z-10 flex-1">
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold">{s.label}</div>
              {s.status === "running" && (
                <Sparkles className="h-3 w-3 text-blue-600 animate-pulse" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {s.label === "Match Scorer" && s.status !== "idle"
                ? `Scoring ${candidateCount || 125} candidates`
                : s.label === "Profile Reader" && s.status !== "idle"
                  ? "Extracting profile data"
                  : s.label === "Red Flag" && s.status !== "idle"
                    ? "Checking compatibility"
                    : s.label === "Wingman" && s.status !== "idle"
                      ? "Generating advice"
                      : s.status === "done"
                        ? "Completed"
                        : "Waiting..."}
            </div>
          </div>

          {/* Step number badge */}
          <div
            className={cn(
              "absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
              s.status === "done"
                ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-md"
                : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
            )}
          >
            {idx + 1}
          </div>
        </li>
      ))}
    </ol>
  )
}
