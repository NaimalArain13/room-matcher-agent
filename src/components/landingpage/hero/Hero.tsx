"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Sparkles, CircleCheck as CheckCircle, ArrowRight, Download } from "lucide-react"
import { generatePDF } from "@/lib/pdf-generator"

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  useEffect(() => {
    gsap.fromTo(".hero-text", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.2 })
  }, [])

 

  return (
    <section className="relative overflow-hidden fade-section">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* TEXT SIDE */}
          <div className="space-y-8">
            <Badge variant="secondary" className="hero-text w-fit bg-blue-100 text-blue-700">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Matching
            </Badge>

            <div className="space-y-4 hero-text">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Find Your Perfect
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Roommate Match
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Smart AI analyzes your preferences and lifestyle to connect you with compatible roommates.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 hero-text">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white" onClick={generatePDF}>
                <Download className="w-5 h-5 mr-2" />
                Download Template
              </Button>
              <Link href="/match">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2">
                  Start Matching
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* IMAGE SIDE */}
          <div className="relative lg:h-[700px] hero-text">
            <Card className="relative overflow-hidden border-2 shadow-2xl">
              <div className="relative h-[400px] lg:h-[500px]">
                <Image
                  src="https://res.cloudinary.com/dfsruso6z/image/upload/v1759248522/Lucid_Origin_A_vibrant_modern_4K_photo_of_diverse_college_stud_1_b3dh5q.jpg"
                  alt="Students finding roommates"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-background/95 backdrop-blur-sm rounded-xl p-4 border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">95% Match Found!</p>
                        <p className="text-xs text-muted-foreground">Compatible preferences</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
