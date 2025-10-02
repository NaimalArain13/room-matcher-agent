"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Pencil, Home, MapPin, DollarSign, Moon, Brush, Volume2, BookOpen, Utensils, FileText } from "lucide-react"
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

  const formatValue = (value: string | number | boolean | null | undefined): string => {
    if (
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "")
    ) {
      return "Not specified"
    }
    return String(value)
  }
  

  const rows: Array<[keyof ParsedProfile, string, React.ComponentType<{ className?: string }>]> = [
    ["city", "City", Home],
    ["area", "Area", MapPin],
    ["budget_PKR", "Budget (PKR)", DollarSign],
    ["sleep_schedule", "Sleep Schedule", Moon],
    ["cleanliness", "Cleanliness", Brush],
    ["noise_tolerance", "Noise Tolerance", Volume2],
    ["study_habits", "Study Habits", BookOpen],
    ["food_pref", "Food Preference", Utensils],
    ["notes", "Notes", FileText],
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm" />
        <CardHeader className="relative z-10 bg-transparent border-b border-gray-200 dark:border-gray-700 px-6 sm:px-8 py-6">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 flex items-center gap-3">
            <CheckCircle className="w-6 h-6" />
            Profile Review
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Craft your perfect match by reviewing your preferences
          </p>
        </CardHeader>
        <CardContent className="relative z-10 px-6 sm:px-8 py-8 space-y-8">
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {rows.map(([key, label, Icon]) => (
              <motion.div
                key={String(key)}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  {label}
                </dt>
                <dd className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                  {formatValue(profile[key])}
                </dd>
              </motion.div>
            ))}
          </dl>

          <div className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onConfirm}
                disabled={confirmDisabled}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300"
                aria-label="Confirm and search matches"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirm & Find Matches
              </Button>
            </motion.div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 font-semibold py-3 rounded-lg transition-all duration-300"
                    aria-label="Edit profile"
                  >
                    <Pencil className="w-5 h-5 mr-2" />
                    Edit Profile
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl max-w-lg sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Customize Your Profile
                  </DialogTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Fine-tune your preferences for the best matches
                  </p>
                </DialogHeader>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-5 py-6"
                >
                  {rows.map(([key, label, Icon]) => (
                    <div key={String(key)} className="space-y-2">
                      <Label
                        htmlFor={String(key)}
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                      >
                        <Icon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                        {label}
                      </Label>
                      <Input
                        id={String(key)}
                        value={draft[key] || ""}
                        onChange={(e) => handleChange(key, key === "budget_PKR" ? Number(e.target.value) : e.target.value)}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-lg bg-white/50 dark:bg-gray-800/50 transition-all duration-200"
                        type={key === "budget_PKR" ? "number" : "text"}
                      />
                    </div>
                  ))}
                </motion.div>

                <DialogFooter className="gap-3 sm:flex-row">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      className="w-full sm:w-auto border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg py-2"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleSave}
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg py-2"
                    >
                      Save Changes
                    </Button>
                  </motion.div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}