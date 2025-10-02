// components/landingpage/hero/HowItWorks.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, Search, MessageSquare } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    { icon: Download, title: "Download Template", description: "Get your personalized roommate preference form template", step: "01" },
    { icon: Upload, title: "Fill & Upload", description: "Complete the form with your preferences and upload it back", step: "02" },
    { icon: Search, title: "AI Analysis", description: "Our AI analyzes compatibility with potential roommates", step: "03" },
    { icon: MessageSquare, title: "Get Matches", description: "Review ranked matches with detailed explanations", step: "04" },
  ]

  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 fade-section">
      <div className="text-center mb-16">
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 mb-4">Simple Process</Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Get matched with your ideal roommate in just four simple steps</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, index) => (
          <Card key={index} className="relative group hover:shadow-lg transition-all duration-300 border-2 card-anim hover:border-blue-200">
            <CardContent className="p-6">
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {item.step}
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
