"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import { Users, Github, Linkedin, Twitter } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (footerRef.current) {
      const ctx = gsap.context(() => {
        if (footerRef.current) {
          gsap.from(footerRef.current.children, {
            opacity: 0,
            y: 40,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 90%", // animate when footer scrolls into view
            },
          })
        }
      }, footerRef)

      return () => ctx.revert()
    }
  }, [])

  return (
    <footer ref={footerRef} className="w-full border-t bg-background mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Room Matcher AI
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered roommate matching for smarter student living. Find your perfect match today.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/#how-it-works" className="hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/match" className="hover:text-foreground transition-colors">
                  Find Match
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/about#contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm">Connect</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Room Matcher AI. Built for hackathon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
