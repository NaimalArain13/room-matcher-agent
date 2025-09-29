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
  confirmDisabled?: boolean
}

export function ParsedProfilePreview({ profile, onEdit, onConfirm, confirmDisabled }: ParsedProfilePreviewProps) {
  const [draft, setDraft] = useState<ParsedProfile>(profile)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleChange = <K extends keyof ParsedProfile>(key: K, value: ParsedProfile[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onEdit(draft)
    setDialogOpen(false)
  }

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return "Not specified"
    }
    if (typeof value === "number") {
      return value.toString()
    }
    if (typeof value === "string" && value.trim() === "") {
      return "Not specified"
    }
    return String(value)
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
        <CardTitle className="text-lg">Parsing complete. Review your profile.</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rows.map(([key, label]) => (
            <div key={String(key)} className="space-y-1">
              <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
              <dd className="text-sm font-medium">{formatValue(profile[key])}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap gap-3">
          <Button onClick={onConfirm} disabled={confirmDisabled}>
            Confirm & search matches
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="secondary">
                Edit profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
              </DialogHeader>

              <div className="grid gap-3">
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input
                    value={draft.city || ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="e.g., Karachi, Lahore, Islamabad"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Area</label>
                  <Input
                    value={draft.area || ""}
                    onChange={(e) => handleChange("area", e.target.value)}
                    placeholder="e.g., Gulshan, DHA, Saddar"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Budget (PKR)</label>
                  <Input
                    type="number"
                    value={draft.budget_PKR || ""}
                    onChange={(e) => handleChange("budget_PKR", Number(e.target.value))}
                    placeholder="e.g., 15000"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Sleep schedule</label>
                  <Input
                    value={draft.sleep_schedule || ""}
                    onChange={(e) => handleChange("sleep_schedule", e.target.value)}
                    placeholder="e.g., early, night_owl, flexible"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Cleanliness</label>
                  <Input
                    value={draft.cleanliness || ""}
                    onChange={(e) => handleChange("cleanliness", e.target.value)}
                    placeholder="e.g., high, medium, low"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Noise tolerance</label>
                  <Input
                    value={draft.noise_tolerance || ""}
                    onChange={(e) => handleChange("noise_tolerance", e.target.value)}
                    placeholder="e.g., low, medium, high"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Study habits</label>
                  <Input
                    value={draft.study_habits || ""}
                    onChange={(e) => handleChange("study_habits", e.target.value)}
                    placeholder="Describe your study patterns"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Food preference</label>
                  <Input
                    value={draft.food_pref || ""}
                    onChange={(e) => handleChange("food_pref", e.target.value)}
                    placeholder="e.g., Vegetarian, Non-veg"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Input
                    value={draft.notes || ""}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Additional notes"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}