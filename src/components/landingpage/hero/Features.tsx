// components/landingpage/hero/Features.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Sparkles, Chrome as Home } from "lucide-react"

export default function Features() {
  const features = [
    { icon: Users, title: "Smart Compatibility", description: "AI analyzes lifestyle habits, schedules, and preferences for optimal matches" },
    { icon: Sparkles, title: "Clear Explanations", description: "Understand why each match works with detailed compatibility breakdowns" },
    { icon: Home, title: "Local Focus", description: "Find roommates in your city and preferred neighborhoods" },
  ]

  return (
    <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 fade-section">
      <div className="text-center mb-16">
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 mb-4">Why Choose Us</Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Advanced AI</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Our intelligent matching system considers multiple factors to find your perfect roommate</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="border-2 hover:border-blue-200 transition-colors card-anim">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/20">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
