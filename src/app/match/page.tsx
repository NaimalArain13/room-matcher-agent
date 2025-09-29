"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ParsedProfilePreview } from "@/components/room-matcher/parsed-profile-preview"
import { FileUpload } from "@/components/room-matcher/file-upload"
import { AgentStepper, type StepState } from "@/components/room-matcher/agent-stepper"
import { MatchCard } from "@/components/room-matcher/match-card"
import { getWingmanAdivce } from "@/api/getWingmanAdivce"
import type { MatchingResults, MatchResultItem, ParsedProfile } from "@/types/matching"

// JSON fixtures
import parsedProfilesJson from "@/data/parsed_profiles.json"
import resultsU001 from "@/data/matching_results_U-001.json"

type ProfileKey = "U-001" | "U-002" | "U-003"

const RESULTS_BY_PROFILE: Record<ProfileKey, MatchingResults> = {
  "U-001": resultsU001 as MatchingResults,
  "U-002": resultsU001 as MatchingResults,
  "U-003": resultsU001 as MatchingResults,
}

const STEPS = ["Profile Reader", "Match Scorer", "Red Flag", "Wingman"] as const

export default function MatchPage() {
  const profiles = parsedProfilesJson as ParsedProfile[]
  const [selectedSample, setSelectedSample] = useState<ProfileKey>("U-001")
  const [qaParsingError, setQaParsingError] = useState(false)
  const [qaFallbackScoring, setQaFallbackScoring] = useState(false)

  const [parsedProfile, setParsedProfile] = useState<ParsedProfile | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [autoRunOnUpload, setAutoRunOnUpload] = useState(true)

  const [steps, setSteps] = useState<StepState[]>(STEPS.map((label) => ({ label, status: "idle" })))
  const [done, setDone] = useState(false)
  const [results, setResults] = useState<MatchingResults | null>(null)

  const profileFromSample = useMemo(
    () => profiles.find((p) => p.id === selectedSample) || profiles[0],
    [profiles, selectedSample],
  )

  const runningRef = useRef(false)

  const startRun = async () => {
    if (!parsedProfile || runningRef.current) return
    runningRef.current = true
    setDone(false)
    setResults(null)

    setSteps(STEPS.map((label) => ({ label, status: "idle" })))

    const next = (index: number, partial?: Partial<StepState>) => {
      setSteps((prev) => {
        const copy = prev.map((s, i) => (i === index ? { ...s, ...partial } : s))
        return copy
      })
    }

    try {
      for (let i = 0; i < STEPS.length; i++) {
        next(i, { status: "running" })
        const delay = 800 + Math.floor(Math.random() * 400)

        if (STEPS[i] === "Match Scorer") {
          await new Promise((r) => setTimeout(r, delay))
          const base = RESULTS_BY_PROFILE[selectedSample]
          const used_fallback = qaFallbackScoring ? true : base.used_fallback
          setResults({ ...base, used_fallback })
        } else if (STEPS[i] === "Wingman") {
          // Call actual wingman API here
          await new Promise((r) => setTimeout(r, delay))
          
          // Optionally fetch real wingman advice:
          // try {
          //   const wingmanData = await getWingmanAdivce({
          //     filtered_matches: results?.matches || [],
          //     profiles: [parsedProfile]
          //   })
          //   // Merge wingman data into results
          // } catch (err) {
          //   console.error("Wingman API failed:", err)
          // }
        } else {
          await new Promise((r) => setTimeout(r, delay))
        }
        next(i, { status: "done" })
      }
    } catch (err) {
      console.error("Agent run failed:", err)
    } finally {
      runningRef.current = false
      setDone(true)
    }
  }

  const onUploadParsed = (p: ParsedProfile) => {
    if (qaParsingError) {
      setParsedProfile(null)
      setParseError("We couldn't extract data from this file — try a DOCX or a clear PDF scan.")
      return
    }
    setParseError(null)
    setParsedProfile(p)
    
    // Auto-run agents if enabled
    if (autoRunOnUpload) {
      // Use a small delay to ensure state updates
      setTimeout(() => {
        startRun()
      }, 100)
    }
  }

  // Auto-run when profile changes and autoRun is enabled
  useEffect(() => {
    if (parsedProfile && autoRunOnUpload && !runningRef.current && !done) {
      startRun()
    }
  }, [parsedProfile, autoRunOnUpload])

  return (
    <main className="min-h-dvh bg-background">
      <header className="w-full border-b">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-semibold text-primary">Room Matcher AI</div>
          <Badge variant="outline">Demo</Badge>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Upload your template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload completed template (.docx, .pdf, images). We'll parse and suggest matches.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="sample">Use alternate sample (QA only)</Label>
                <Select value={selectedSample} onValueChange={(v) => setSelectedSample(v as ProfileKey)}>
                  <SelectTrigger id="sample" className="w-full">
                    <SelectValue placeholder="Select sample" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="U-001">Sample U-001</SelectItem>
                    <SelectItem value="U-002">Sample U-002</SelectItem>
                    <SelectItem value="U-003">Sample U-003</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="qa-parse"
                    checked={qaParsingError}
                    onCheckedChange={setQaParsingError}
                    aria-label="Toggle parsing failure"
                  />
                  <Label htmlFor="qa-parse">QA: Force parsing error</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="qa-fallback"
                    checked={qaFallbackScoring}
                    onCheckedChange={setQaFallbackScoring}
                    aria-label="Toggle fallback scoring"
                  />
                  <Label htmlFor="qa-fallback">QA: Fallback scoring</Label>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="auto-run"
                checked={autoRunOnUpload}
                onCheckedChange={setAutoRunOnUpload}
                aria-label="Toggle auto-run"
              />
              <Label htmlFor="auto-run">Auto-run agents after upload</Label>
            </div>

            <FileUpload 
            //@ts-ignore
              onComplete={onUploadParsed} 
              disabled={runningRef.current}
            />

            {parseError ? (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Parsing error</AlertTitle>
                <AlertDescription>{parseError}</AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
        </Card>

        {parsedProfile ? (
          <ParsedProfilePreview 
            profile={parsedProfile} 
            onEdit={(p) => setParsedProfile(p)} 
            onConfirm={startRun}
            confirmDisabled={runningRef.current}
          />
        ) : null}

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Matching flow</CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            <AgentStepper steps={steps} candidateCount={results?.candidate_count ?? 0} />
          </CardContent>
        </Card>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Top matches for you</h2>
            <div className="text-sm text-muted-foreground">
              {done && results ? `${results.matches.length} shown` : ""}
            </div>
          </div>
          <Separator />

          {results?.used_fallback ? (
            <Alert variant="default">
              <AlertTitle>Notice</AlertTitle>
              <AlertDescription>We used local fallback scoring — results shown below.</AlertDescription>
            </Alert>
          ) : null}

          {!done && !runningRef.current ? (
            <p className="text-sm text-muted-foreground">
              {parsedProfile 
                ? "Click 'Confirm & Match' to run the agents and see your results." 
                : "Upload a file to get started."}
            </p>
          ) : null}

          {runningRef.current ? (
            <p className="text-sm text-muted-foreground">Running agents...</p>
          ) : null}

          {done && results && results.matches.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No good matches found. Try increasing budget or widening city.
            </p>
          ) : null}

          {done && results ? (
            <div className="grid gap-4 md:grid-cols-2">
              {results.matches.map((m: MatchResultItem) => (
                <MatchCard
                  key={m.roommate_id}
                  result={m}
                  parsedProfile={parsedProfile}
                  wingmanText={results.wingman[m.roommate_id]}
                  //@ts-ignore
                  allMatches={results.matches}
                />
              ))}
            </div>
          ) : null}
        </section>
      </section>
    </main>
  )
}