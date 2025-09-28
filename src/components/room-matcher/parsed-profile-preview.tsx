"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { ParsedProfile } from "@/types/matching"

interface ParsedProfilePreviewProps {
  profile: ParsedProfile
  onEdit: (p: ParsedProfile) => void
  onConfirm: () => void
}

export function ParsedProfilePreview({ profile, onEdit, onConfirm }: ParsedProfilePreviewProps) {
  const [draft, setDraft] = useState<ParsedProfile>(profile)

  const handleChange = <K extends keyof ParsedProfile>(key: K, value: ParsedProfile[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const rows: Array<[keyof ParsedProfile, string]> = [
    ["city", "City"],
    ["area", "Area"],
    ["budget_PKR", "Budget (PKR)"],
    ["sleep_schedule", "Sleep schedule"],
    ["cleanliness", "Cleanliness"],
    ["noise_tolerance", "Noise tolerance"],
    ["study_habits", "Study habits"],
    ["food_pref", "Food preference"],
    ["notes", "Notes"],
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Parsing complete. Preview profile.</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rows.map(([key, label]) => (
            <div key={String(key)} className="space-y-1">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="text-sm">{String(profile[key])}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap gap-3">
          <Button onClick={onConfirm}>Confirm & search matches</Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="secondary">
                Edit profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
              </DialogHeader>

              <div className="grid gap-3">
                <Input
                  value={draft.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="City"
                  aria-label="City"
                />
                <Input
                  value={draft.area}
                  onChange={(e) => handleChange("area", e.target.value)}
                  placeholder="Area"
                  aria-label="Area"
                />
                <Input
                  type="number"
                  value={draft.budget_PKR}
                  onChange={(e) => handleChange("budget_PKR", Number(e.target.value))}
                  placeholder="Budget PKR"
                  aria-label="Budget PKR"
                />
                <Input
                  value={draft.sleep_schedule}
                  onChange={(e) => handleChange("sleep_schedule", e.target.value)}
                  placeholder="Sleep schedule"
                  aria-label="Sleep schedule"
                />
                <Input
                  value={draft.cleanliness}
                  onChange={(e) => handleChange("cleanliness", e.target.value)}
                  placeholder="Cleanliness"
                  aria-label="Cleanliness"
                />
                <Input
                  value={draft.noise_tolerance}
                  onChange={(e) => handleChange("noise_tolerance", e.target.value)}
                  placeholder="Noise tolerance"
                  aria-label="Noise tolerance"
                />
                <Input
                  value={draft.study_habits}
                  onChange={(e) => handleChange("study_habits", e.target.value)}
                  placeholder="Study habits"
                  aria-label="Study habits"
                />
                <Input
                  value={draft.food_pref}
                  onChange={(e) => handleChange("food_pref", e.target.value)}
                  placeholder="Food preference"
                  aria-label="Food preference"
                />
                <Input
                  value={draft.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Notes"
                  aria-label="Notes"
                />
              </div>

              <DialogFooter className="gap-2">
                <Button onClick={() => onEdit(draft)}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
