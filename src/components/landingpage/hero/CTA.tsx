// components/landingpage/hero/CTA.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ArrowRight } from "lucide-react"
import Link from "next/link"
import { generatePDF } from "@/lib/pdf-generator"

export default function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 fade-section">
      <Card className="relative overflow-hidden border-2 bg-gradient-to-br from-blue-600 to-cyan-600 card-anim hover:border-blue-200">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        <CardContent className="relative p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Perfect Match?</h2>
          <p className="text-lg mb-8 text-blue-50 max-w-2xl mx-auto">Join hundreds of students who have already found their ideal roommates using our AI-powered platform</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg text-base h-12" onClick={generatePDF}>
              <Download className="w-5 h-5 mr-2" />
              Download Template
            </Button>
            <Link href="/match">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-black border-2 border-white hover:bg-white/10 text-base h-12">
                Start Matching Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
