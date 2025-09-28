"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { MatchResultItem, ParsedProfile } from "@/types/matching"
import { cn } from "@/lib/utils"

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
  // take top 2
  return list.slice(0, 2)
}

export function MatchCard({ result, parsedProfile, wingmanText }: MatchCardProps) {
  const [open, setOpen] = useState(false)
  const [forcedInclude, setForcedInclude] = useState(false)

  const factors = computeFactors(parsedProfile, result)
  const hasRedFlags = result.red_flags.length > 0

  return (
    <Card className={cn("relative", hasRedFlags ? "border-destructive" : "")}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              aria-label="Match score"
              className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold"
            >
              {result.score}%
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-medium">{result.roommate_id}</div>
              <div className="text-xs text-muted-foreground">
                {result.short.city} • {result.short.area}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasRedFlags ? <Badge variant="destructive">Red flag</Badge> : null}
            {forcedInclude ? <Badge variant="outline">Force included</Badge> : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          <div>
            Budget PKR: <span className="text-muted-foreground">{result.short.budget_PKR}</span>
          </div>
          <div>
            Cleanliness: <span className="text-muted-foreground">{result.short.cleanliness}</span>
          </div>
          <div>
            Sleep: <span className="text-muted-foreground">{result.short.sleep_schedule}</span>
          </div>
        </div>

        <div className="text-sm">
          <span className="font-medium">Top factors:</span>{" "}
          {factors.length > 0 ? factors.join(" · ") : "Similarity based on profile"}
        </div>

        <div className="flex flex-wrap gap-2">
          <Collapsible open={open} onOpenChange={setOpen} className="w-full">
            <CollapsibleTrigger asChild>
              <Button variant="secondary" aria-expanded={open}>
                {open ? "Hide profile" : "View profile"}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div>
                  City: <span className="text-muted-foreground">{result.short.city}</span>
                </div>
                <div>
                  Area: <span className="text-muted-foreground">{result.short.area}</span>
                </div>
                <div>
                  Budget PKR: <span className="text-muted-foreground">{result.short.budget_PKR}</span>
                </div>
                <div>
                  Cleanliness: <span className="text-muted-foreground">{result.short.cleanliness}</span>
                </div>
                <div>
                  Sleep schedule: <span className="text-muted-foreground">{result.short.sleep_schedule}</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">Ask Wingman for advice</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Wingman advice</DialogTitle>
              </DialogHeader>
              <p className="text-sm leading-relaxed">{wingmanText || "Advice not available."}</p>
              <div className="text-sm text-muted-foreground pt-2">
                • Try agreeing on quiet hours 11pm–7am
                <br />• Consider a weekly cleaning rota
              </div>
            </DialogContent>
          </Dialog>

          {hasRedFlags ? (
            <Button variant="outline" onClick={() => setForcedInclude(true)} disabled={forcedInclude}>
              Force include
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
