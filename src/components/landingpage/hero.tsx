"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import {
  Sparkles,
  Users,
  CircleCheck as CheckCircle,
  Upload,
  Search,
  MessageSquare,
  Chrome as Home,
  ArrowRight,
  Download,
} from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  useEffect(() => {
    // Hero text entrance
    gsap.fromTo(
      ".hero-text",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
    )

    // Fade-in sections
    gsap.utils.toArray<HTMLElement>(".fade-section").forEach((section) => {
      gsap.fromTo(
        section,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        }
      )
    })

    // Card stagger animations
    gsap.utils.toArray<HTMLElement>(".card-anim").forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        }
      )
    })
  }, [])

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842])
    const { height } = page.getSize()

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    let y = height - 50

    page.drawText("Roommate Preference Form Template", {
      x: 50,
      y,
      size: 18,
      font: boldFont,
      color: rgb(0, 0, 0.8),
    })
    y -= 40

    const instructions =
      "Please fill out this form with your roommate preferences. " +
      "Download this template, convert it to .docx, fill it in Word, and upload it back."
    page.drawText(instructions, {
      x: 50,
      y,
      size: 12,
      font,
      color: rgb(0, 0, 0),
      maxWidth: 500,
    })
    y -= 60

    page.drawText("Personal Information", {
      x: 50,
      y,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0.8),
    })
    y -= 30

    const fields = [
      "City",
      "Area/Neighborhood",
      "Budget (PKR)",
      "Sleep Schedule",
      "Cleanliness Level",
      "Noise Tolerance",
      "Study Habits",
      "Food Preference",
      "Additional Preferences",
    ]

    fields.forEach((field) => {
      page.drawText(`${field}: ____________________________`, {
        x: 50,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      })
      y -= 25
    })

    y -= 20

    page.drawText("Field Descriptions:", {
      x: 50,
      y,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0.8),
    })
    y -= 30

    const descriptions: [string, string][] = [
      ["City", "The city where you want to find accommodation"],
      ["Area/Neighborhood", "Specific area or neighborhood within the city"],
      ["Budget (PKR)", "Your monthly budget in Pakistani Rupees"],
      ["Sleep Schedule", "Your preferred sleep schedule (e.g., Early bird, Night owl)"],
      ["Cleanliness Level", "Your cleanliness standards (e.g., Tidy, Relaxed)"],
      ["Noise Tolerance", "Your tolerance for noise (e.g., Quiet, Loud)"],
      ["Study Habits", "Your study patterns (e.g., Early morning, Late night)"],
      ["Food Preference", "Your dietary preferences (e.g., Veg, Non-veg, Vegan)"],
      ["Additional Preferences", "Any other requirements you have"],
    ]

    descriptions.forEach(([field, desc]) => {
      page.drawText(`${field}: ${desc}`, {
        x: 50,
        y,
        size: 11,
        font,
        color: rgb(0, 0, 0),
        maxWidth: 500,
      })
      y -= 20
    })

    y -= 20

    page.drawText("Instructions:", {
      x: 50,
      y,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0.8),
    })
    y -= 25

    const steps = [
      "1. Download this PDF template",
      "2. Convert the PDF to .docx format",
      "3. Open the .docx file in Microsoft Word",
      "4. Fill in all the required fields",
      "5. Save the completed form",
      "6. Upload the filled .docx file back to the system",
    ]

    steps.forEach((step) => {
      page.drawText(step, {
        x: 50,
        y,
        size: 11,
        font,
        color: rgb(0, 0, 0),
      })
      y -= 18
    })

    const pdfBytes = await pdfDoc.save()
    //@ts-ignore
    const blob = new Blob([pdfBytes], { type: "application/pdf" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "roommate_preference_template.pdf"
    link.click()
  }

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative overflow-hidden fade-section">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-background dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-background"></div>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-800"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* TEXT SIDE */}
            <div className="space-y-8">
              <Badge variant="secondary" className="hero-text w-fit bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800">
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
                  Smart AI analyzes your preferences and lifestyle to connect you with compatible roommates. Say goodbye to awkward living situations.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 hero-text">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-600/20 text-base h-12"
                  onClick={generatePDF}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Template
                </Button>
                <Link href="/match">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 border-2">
                    Start Matching
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>

          <div className="flex justify-center sm:justify-start w-full">
            <div className="flex flex-col sm:flex-row items-center gap-8 pt-4 hero-text max-w-full">
              <div className="flex -space-x-3">
                {[
                  "https://randomuser.me/api/portraits/men/32.jpg",
                  "https://randomuser.me/api/portraits/women/65.jpg",
                  "https://randomuser.me/api/portraits/women/22.jpg",
                ].map((src, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-full border-2 border-background overflow-hidden block"
                  >
                    <img src={src.trim()} alt={`Student ${i + 1}`} className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold">500+ Students Matched</p>
                <p className="text-xs text-muted-foreground">Join the community</p>
              </div>
            </div>
          </div>
          </div>

            {/* IMAGE SIDE */}
            <div className="relative lg:h-[700px] hero-text">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl blur-3xl opacity-20"></div>
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
                      <div className="flex items-center gap-3 mb-2">
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

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 fade-section">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800 mb-4">
            Simple Process
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get matched with your ideal roommate in just four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Download,
              title: "Download Template",
              description: "Get your personalized roommate preference form template",
              step: "01",
            },
            {
              icon: Upload,
              title: "Fill & Upload",
              description: "Complete the form with your preferences and upload it back",
              step: "02",
            },
            {
              icon: Search,
              title: "AI Analysis",
              description: "Our AI analyzes compatibility with potential roommates",
              step: "03",
            },
            {
              icon: MessageSquare,
              title: "Get Matches",
              description: "Review ranked matches with detailed explanations",
              step: "04",
            },
          ].map((item, index) => (
            <Card key={index} className="relative group hover:shadow-lg transition-all duration-300 border-2 card-anim">
              <CardContent className="p-6">
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950 dark:to-cyan-950 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 fade-section">
        <div className="text-center mb-16">
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800 mb-4">
            Why Choose Us
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Advanced AI</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our intelligent matching system considers multiple factors to find your perfect roommate
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: "Smart Compatibility",
              description: "AI analyzes lifestyle habits, schedules, and preferences for optimal matches",
            },
            {
              icon: Sparkles,
              title: "Clear Explanations",
              description: "Understand why each match works with detailed compatibility breakdowns",
            },
            {
              icon: Home,
              title: "Local Focus",
              description: "Find roommates in your city and preferred neighborhoods",
            },
          ].map((feature, index) => (
            <Card key={index} className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors card-anim">
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

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 fade-section">
        <Card className="relative overflow-hidden border-2 bg-gradient-to-br from-blue-600 to-cyan-600">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
          <CardContent className="relative p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Perfect Match?</h2>
            <p className="text-lg mb-8 text-blue-50 max-w-2xl mx-auto">
              Join hundreds of students who have already found their ideal roommates using our AI-powered platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg text-base h-12"
                onClick={generatePDF}
              >
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
    </div>
  )
}
