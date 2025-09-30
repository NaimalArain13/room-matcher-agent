import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { MatchResultItem, ParsedProfile } from "@/types/matching"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Heart, AlertTriangle, ChevronDown, Sparkles, MapPin, Coins, Moon, Sparkle } from "lucide-react"

interface MatchCardProps {
  result: MatchResultItem
  parsedProfile: ParsedProfile | null
  wingmanText?: string
}

function computeFactors(a: ParsedProfile | null, b: MatchResultItem): string[] {
  const list: string[] = []
  if (a && a.sleep_schedule === b.short.sleep_schedule) list.push("Sleep schedule aligns")
  if (a && Math.abs(a.budget_PKR - b.short.budget_PKR) <= 3000) list.push("Budget is close")
  if (a && a.cleanliness === b.short.cleanliness) list.push("Similar cleanliness")
  return list.slice(0, 2)
}

export function MatchCard({ result, parsedProfile, wingmanText }: MatchCardProps) {
  const [open, setOpen] = useState(false)
  const [forcedInclude, setForcedInclude] = useState(false)
  const [adviceLoading, setAdviceLoading] = useState(false)
  const [adviceText, setAdviceText] = useState<string | null>(wingmanText ?? null)
  const [recommendationText, setRecommendationText] = useState<string | null>(null)
  const { toast } = useToast()

  const cardRef = useRef<HTMLDivElement>(null)
  const scoreRef = useRef<HTMLDivElement>(null)
  const badgesRef = useRef<HTMLDivElement>(null)

  const factors = computeFactors(parsedProfile, result)
  const hasRedFlags = result.red_flags.length > 0

  useEffect(() => {
    if (cardRef.current) {
      // Hover animation
      const card = cardRef.current

      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -8,
          scale: 1.02,
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          duration: 0.3,
          ease: "power2.out"
        })
      }

      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          duration: 0.3,
          ease: "power2.out"
        })
      }

      card.addEventListener("mouseenter", handleMouseEnter)
      card.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        card.removeEventListener("mouseenter", handleMouseEnter)
        card.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  useEffect(() => {
    if (scoreRef.current) {
      gsap.fromTo(
        scoreRef.current,
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.2
        }
      )
    }

    if (badgesRef.current) {
      gsap.fromTo(
        badgesRef.current.children,
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out"
        }
      )
    }
  }, [])

  const handleWingmanClick = async () => {
    setAdviceLoading(true)

    // Animate button
    gsap.to(".wingman-btn", {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    })

    try {
      const payload = {
        filtered_matches: [result as unknown as Record<string, unknown>],
        profiles: [
          (parsedProfile as unknown as Record<string, unknown>) ||
            ({} as Record<string, unknown>),
        ],
      }

      // Mock response for demo
      await new Promise(resolve => setTimeout(resolve, 1500))

      const mockAdvice = `Based on your compatibility score of ${result.score}%, this is a strong match! ${factors.join(". ")}. Consider discussing shared responsibilities and setting clear boundaries early on.`
      const mockRecommendation = "Highly recommended - schedule a meeting to discuss living arrangements and expectations."

      setAdviceText(mockAdvice)
      setRecommendationText(mockRecommendation)

    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch advice"
      setAdviceText("Advice not available.")
      setRecommendationText(null)
      toast({ title: "Wingman error", description: message })
    } finally {
      setAdviceLoading(false)
    }
  }

  return (
    <Card
      ref={cardRef}
      className={cn(
        "relative overflow-hidden border-2 transition-all duration-300",
        hasRedFlags
          ? "border-red-300 dark:border-red-800 bg-red-50/30 dark:bg-red-950/30"
          : "border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900"
      )}
    >
      {/* Gradient overlay */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl" />

      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Score Circle */}
            <div
              ref={scoreRef}
              aria-label="Match score"
              className="relative h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex flex-col items-center justify-center shadow-lg"
            >
              <div className="text-xl font-bold">{result.score}%</div>
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 opacity-20 animate-pulse" />
            </div>

            {/* Profile Info */}
            <div className="space-y-1">
              <div className="text-lg font-bold">{result.roommate_id}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {result.short.city} • {result.short.area}
              </div>
            </div>
          </div>

          {/* Badges */}
          <div ref={badgesRef} className="flex flex-col items-end gap-2">
            {hasRedFlags ? (
              <Badge variant="destructive" className="shadow-md">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Red Flag
              </Badge>
            ) : (
              <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md">
                <Heart className="w-3 h-3 mr-1" />
                Great Match
              </Badge>
            )}
            {forcedInclude && (
              <Badge variant="outline">Force Included</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800">
            <Coins className="w-5 h-5 text-blue-600 mb-1" />
            <div className="text-xs text-muted-foreground">Budget</div>
            <div className="text-sm font-semibold">{result.short.budget_PKR}</div>
          </div>

          <div className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800">
            <Sparkle className="w-5 h-5 text-cyan-600 mb-1" />
            <div className="text-xs text-muted-foreground">Clean</div>
            <div className="text-sm font-semibold">{result.short.cleanliness}</div>
          </div>

          <div className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800">
            <Moon className="w-5 h-5 text-purple-600 mb-1" />
            <div className="text-xs text-muted-foreground">Sleep</div>
            <div className="text-sm font-semibold text-center leading-tight">{result.short.sleep_schedule}</div>
          </div>
        </div>

        {/* Match Factors */}
        <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold">Why this match works</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {factors.length > 0 ? factors.join(" • ") : "High compatibility based on profile analysis"}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Collapsible open={open} onOpenChange={setOpen} className="w-full">
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-2 hover:border-blue-400 transition-all"
                aria-expanded={open}
              >
                {open ? "Hide Details" : "View Full Profile"}
                <ChevronDown className={cn("w-4 h-4 ml-2 transition-transform", open && "rotate-180")} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">City</div>
                  <div className="text-sm font-medium">{result.short.city}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Area</div>
                  <div className="text-sm font-medium">{result.short.area}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Budget PKR</div>
                  <div className="text-sm font-medium">{result.short.budget_PKR}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Cleanliness</div>
                  <div className="text-sm font-medium">{result.short.cleanliness}</div>
                </div>
                <div className="space-y-1 col-span-2">
                  <div className="text-xs text-muted-foreground">Sleep Schedule</div>
                  <div className="text-sm font-medium">{result.short.sleep_schedule}</div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="wingman-btn flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
                onClick={handleWingmanClick}
                disabled={adviceLoading}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {adviceLoading ? "Thinking..." : "Get AI Advice"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  Wingman AI Advice
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800">
                  <div className="font-semibold mb-2">Compatibility Analysis</div>
                  <div className="text-sm leading-relaxed">
                    {adviceLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Analyzing compatibility...
                      </div>
                    ) : (
                      adviceText || "Advice not available."
                    )}
                  </div>
                </div>

                {recommendationText && (
                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800">
                    <div className="font-semibold mb-2">Recommendation</div>
                    <div className="text-sm leading-relaxed">{recommendationText}</div>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm space-y-2">
                  <div className="font-semibold">Tips for Success:</div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Agree on quiet hours (e.g., 11pm–7am)</li>
                    <li>• Create a weekly cleaning schedule</li>
                    <li>• Discuss shared expenses upfront</li>
                    <li>• Set boundaries for guests and visitors</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {hasRedFlags && (
            <Button
              variant="outline"
              className="border-2 border-red-300 hover:border-red-400 text-red-700 dark:text-red-400"
              onClick={() => {
                setForcedInclude(true)
                gsap.fromTo(
                  cardRef.current,
                  { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                  { backgroundColor: "rgba(59, 130, 246, 0.1)", duration: 0.8 }
                )
              }}
              disabled={forcedInclude}
            >
              Force Include Match
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

