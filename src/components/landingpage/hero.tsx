"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

export default function Hero() {
  // PDF Generate Handler
  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842]) // A4 size
    const { height } = page.getSize()

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    let y = height - 50

    // Title
    page.drawText("Roommate Preference Form Template", {
      x: 50,
      y,
      size: 18,
      font: boldFont,
      color: rgb(0, 0, 0.8),
    })
    y -= 40

    // Instructions
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

    // Section Header
    page.drawText("Personal Information", {
      x: 50,
      y,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0.8),
    })
    y -= 30

    // Fields
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

    // Field Descriptions
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

    // Instructions (Steps)
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

    // Save PDF
    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: "application/pdf" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "roommate_preference_template.pdf"
    link.click()
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-20">
      <div className="grid gap-10 md:grid-cols-2 items-center">
        {/* Left Side Content */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight text-pretty">
            Smarter student living — find compatible roommates & rooms.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Upload your completed profile template, preview the parsed details, and
            see ranked matches with clear explanations and wingman advice.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button size="lg" onClick={generatePDF}>
              Download Profile Template
            </Button>
            <Link href="/match">
              <Button size="lg" variant="secondary">Start Matching</Button>
            </Link>
          </div>
        </div>

        {/* Right Side Random Image */}
        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="https://res.cloudinary.com/db3yy1i0j/image/upload/v1759023648/images_2_i7sdlh.jpg"
            alt="Students finding roommates"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  )
}
