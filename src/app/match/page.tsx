'use client'

import { useCallback, useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
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
import type { MatchingResults, MatchResultItem, ParsedProfile } from "@/types/matching"
import { Sparkles, Upload } from "lucide-react"
import { FlowTracer } from "@/types/trace"

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

gsap.registerPlugin(ScrollTrigger)

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

  const runningRef = useRef(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const uploadSectionRef = useRef<HTMLDivElement>(null)
  const stepperRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Entrance animations
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )

      gsap.fromTo(
        uploadSectionRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, delay: 0.2, ease: "power3.out" }
      )

      gsap.fromTo(
        ".animate-badge",
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.6, delay: 0.4, ease: "back.out(1.7)" }
      )
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (parsedProfile) {
      gsap.fromTo(
        ".profile-preview",
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      )
    }
  }, [parsedProfile])

  useEffect(() => {
    if (runningRef.current && stepperRef.current) {
      gsap.fromTo(
        stepperRef.current,
        { scale: 0.98, opacity: 0.8 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        }
      )
    }
  }, [steps])

  useEffect(() => {
    if (done && results && results.matches.length > 0) {
      gsap.fromTo(
        ".match-card",
        { y: 60, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out"
        }
      )

      // Floating animation for match cards
      gsap.to(".match-card", {
        y: -5,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: {
          each: 0.2,
          repeat: -1
        }
      })
    }
  }, [done, results])

  const startRun = useCallback(async () => {
    if (!parsedProfile || runningRef.current) return
    FlowTracer.log('Matching Flow', 'start', { profileId: parsedProfile.id })
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
        FlowTracer.log(STEPS[i], 'start')
        next(i, { status: "running" })

        if (STEPS[i] === "Profile Reader") {
          await new Promise((r) => setTimeout(r, 800))
          FlowTracer.log(STEPS[i], 'success')


        } else if (STEPS[i] === "Match Scorer") {
          try {
            const baseUrl = process.env.NEXT_PUBLIC_API_SERVER
            if (!baseUrl) throw new Error("API server not configured")

            const response = await fetch(`${baseUrl}/api/match-profile`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(parsedProfile)
            })

            if (!response.ok) {
              throw new Error(`Matching failed: ${response.status}`)
            }

            const matchData = await response.json()
            FlowTracer.log(STEPS[i], 'success', {
              matchCount: matchData.matches?.length,
              candidateCount: matchData.candidate_count,
              topScore: matchData.matches?.[0]?.score
            })
            setResults(matchData)

          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err)
            FlowTracer.log(STEPS[i], 'error', { error: errorMsg })
            console.error("Matching API error:", err)
            const base = RESULTS_BY_PROFILE[selectedSample]
            const used_fallback = true
            setResults({ ...base, used_fallback })
          }

        } else if (STEPS[i] === "Red Flag") {
          await new Promise((r) => setTimeout(r, 800))
          FlowTracer.log(STEPS[i], 'success')


        } else if (STEPS[i] === "Wingman") {
          await new Promise((r) => setTimeout(r, 800))
          FlowTracer.log(STEPS[i], 'success')


        } else {
          await new Promise((r) => setTimeout(r, 800))
          FlowTracer.log(STEPS[i], 'success')
        }

        next(i, { status: "done" })
      }
      FlowTracer.log('Matching Flow', 'success', {
        totalMatches: results?.matches.length
      })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      FlowTracer.log('Matching Flow', 'error', { error: errorMsg })
      console.error("Agent run failed:", err)
    } finally {
      runningRef.current = false
      setDone(true)
    }
  }, [parsedProfile, selectedSample, results?.matches?.length])

  const onUploadParsed = (p: ParsedProfile) => {
    if (qaParsingError) {
      FlowTracer.log('Profile Parsing', 'error', { reason: 'QA parsing error forced' })
      setParsedProfile(null)
      setParseError("We couldn't extract data from this file — try a DOCX or a clear PDF scan.")
      return
    }

    FlowTracer.log('Profile Parsed', 'success', {
      id: p.id,
      city: p.city,
      area: p.area,
      budget: p.budget_PKR
    })

    setParseError(null)
    setParsedProfile(p)

    if (autoRunOnUpload) {
      setTimeout(() => {
        startRun()
      }, 100)
    }
  }

  useEffect(() => {
    if (parsedProfile && autoRunOnUpload && !runningRef.current && !done) {
      startRun()
    }
  }, [parsedProfile, autoRunOnUpload, startRun, done])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950">
      {/* Animated background grid */}
      <div className="fixed inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />

      {/* Floating gradient orbs */}
      <div className="fixed top-20 left-20 w-72 h-72 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="fixed top-40 right-20 w-72 h-72 bg-cyan-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="fixed bottom-20 left-1/2 w-72 h-72 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />


      <section className="relative mx-auto max-w-7xl px-4 py-8 space-y-8">
        {/* Upload Section */}
        <div ref={uploadSectionRef}>
          <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />
            <CardHeader className="relative pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Upload Your Profile
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload your completed template and let AI find your perfect match
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="sample" className="text-sm font-medium">Sample Profile (QA Testing)</Label>
                  <Select value={selectedSample} onValueChange={(v) => setSelectedSample(v as ProfileKey)}>
                    <SelectTrigger id="sample" className="w-full border-2 hover:border-blue-400 transition-colors">
                      <SelectValue placeholder="Select sample" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="U-001">Sample U-001</SelectItem>
                      <SelectItem value="U-002">Sample U-002</SelectItem>
                      <SelectItem value="U-003">Sample U-003</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <Label htmlFor="qa-parse" className="text-sm font-medium cursor-pointer">Force parsing error</Label>
                    <Switch
                      id="qa-parse"
                      checked={qaParsingError}
                      onCheckedChange={setQaParsingError}
                      aria-label="Toggle parsing failure"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <Label htmlFor="qa-fallback" className="text-sm font-medium cursor-pointer">Fallback scoring</Label>
                    <Switch
                      id="qa-fallback"
                      checked={qaFallbackScoring}
                      onCheckedChange={setQaFallbackScoring}
                      aria-label="Toggle fallback scoring"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-2 border-blue-200 dark:border-blue-800">
                <Label htmlFor="auto-run" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Auto-run agents after upload
                </Label>
                <Switch
                  id="auto-run"
                  checked={autoRunOnUpload}
                  onCheckedChange={setAutoRunOnUpload}
                  aria-label="Toggle auto-run"
                />
              </div>

              <FileUpload
                // @ts-expect-error: FileUpload onComplete typing differs, accepts ParsedProfile here
                onComplete={onUploadParsed}
                disabled={runningRef.current}
              />


              {parseError ? (
                <Alert variant="destructive" className="animate-in slide-in-from-top-2 border-2">
                  <AlertTitle className="font-semibold">Parsing Error</AlertTitle>
                  <AlertDescription>{parseError}</AlertDescription>
                </Alert>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Profile Preview */}
        {parsedProfile ? (
          <div className="profile-preview">
            <ParsedProfilePreview
              profile={parsedProfile}
              onEdit={(p) => setParsedProfile(p)}
              onConfirm={startRun}
              confirmDisabled={runningRef.current}
            />
          </div>
        ) : null}

        {/* Agent Stepper */}
        <div ref={stepperRef}>
          <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl" />
            <CardHeader className="relative pb-4">
              <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                AI Matching Pipeline
              </CardTitle>
              <p className="text-sm text-muted-foreground">Watch as our AI agents analyze and match profiles</p>
            </CardHeader>
            <CardContent className="relative py-6">
              <AgentStepper steps={steps} candidateCount={results?.candidate_count ?? 0} />
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <section ref={resultsRef} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Your Perfect Matches
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {done && results ? `${results.matches.length} compatible roommates found` : "Waiting for analysis..."}
              </p>
            </div>
            {done && results && results.matches.length > 0 && (
              <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-lg px-4 py-2 shadow-lg">
                <Sparkles className="w-4 h-4 mr-2" />
                {results.matches.length} Matches
              </Badge>
            )}
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-blue-300 to-transparent h-0.5" />

          {results?.used_fallback ? (
            <Alert className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50 animate-in slide-in-from-top-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-900 dark:text-blue-100">Notice</AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                We used local fallback scoring — results shown below.
              </AlertDescription>
            </Alert>
          ) : null}

          {!done && !runningRef.current ? (
            <Card className="border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-950/30">
              <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <p className="text-center text-muted-foreground max-w-md">
                  {parsedProfile
                    ? "Click 'Confirm & Match' to run the agents and see your results."
                    : "Upload a file to get started with intelligent roommate matching."}
                </p>
              </CardContent>
            </Card>
          ) : null}

          {runningRef.current ? (
            <Card className="border-2 border-blue-300 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50">
              <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg animate-pulse">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 animate-ping opacity-20" />
                </div>
                <p className="text-center font-medium text-lg">
                  AI Agents are analyzing your profile...
                </p>
              </CardContent>
            </Card>
          ) : null}

          {done && results && results.matches.length === 0 ? (
            <Card className="border-2 border-slate-200 dark:border-slate-700">
              <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                <p className="text-center text-muted-foreground max-w-md">
                  No good matches found. Try increasing budget or widening city preferences.
                </p>
              </CardContent>
            </Card>
          ) : null}

          {done && results ? (
            <div className="grid gap-6 md:grid-cols-2">
              {results.matches.map((m: MatchResultItem) => (
                <div key={m.roommate_id} className="match-card">
                  <MatchCard
                    result={m}
                    parsedProfile={parsedProfile}
                    wingmanText={results.wingman[m.roommate_id]}
                   // @ts-expect-error: MatchCard expects a stricter type, passing full matches for context
                    allMatches={results.matches}

                  />
                </div>
              ))}
            </div>
          ) : null}
        </section>
      </section>
    </main>
  )
}
