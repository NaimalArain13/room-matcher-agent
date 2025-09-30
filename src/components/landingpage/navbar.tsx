"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Users, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { gsap } from "gsap"
import { TraceViewer } from "../room-matcher/trace-viewer"

export default function Navbar() {
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (navRef.current) {
      const ctx = gsap.context(() => {
        // logo + brand
        gsap.from(".nav-logo", {
          opacity: 0,
          y: -20,
          duration: 0.8,
          ease: "power3.out",
        })

        // links
        gsap.from(".nav-link", {
          opacity: 0,
          y: -20,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.2,
          ease: "power3.out",
        })

        // button
        gsap.from(".nav-btn", {
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          delay: 0.6,
          ease: "back.out(1.7)",
        })
      }, navRef)

      return () => ctx.revert()
    }
  }, [])

  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={navRef} className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group nav-logo">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative flex items-center justify-center w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Room Matcher AI
            </span>
          </Link>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#how-it-works" className="nav-link text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="/#features" className="nav-link text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/about" className="nav-link text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/match" className="nav-link text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Find Match
            </Link>
            <TraceViewer/>
          </nav>

          {/* Button */}
          <Link href="/match" className="nav-btn">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-600/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
