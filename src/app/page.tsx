// app/page.tsx
"use client"


import Hero from "@/components/landingpage/hero/Hero"
import HowItWorks from "@/components/landingpage/hero/HowItWorks"
import Features from "@/components/landingpage/hero/Features"
import CTA from "@/components/landingpage/hero/CTA"
import { Team } from "@/components/landingpage/teams/Team"
import { useGsapAnimations } from "@/hooks/useGsapAnimations"

export default function HomePage(){
  useGsapAnimations() // runs the animations globally (same behavior as your original code)

  return (
    <main className="min-h-dvh flex flex-col bg-background">
   
      <div className="flex-grow">
        <Hero />
        <HowItWorks />
        <Features />
        <Team />
        <CTA />
      </div>
   
    </main>
  )
}
