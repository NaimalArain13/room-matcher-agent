import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

export async function generatePDF() {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4 size
  const { height } = page.getSize()

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let y = height - 50

  // ===== Title =====
  page.drawText("Roommate Preference Form Template", {
    x: 50,
    y,
    size: 20,
    font: boldFont,
    color: rgb(0, 0, 0.8),
  })
  y -= 40

  // ===== Intro Instructions =====
  const intro =
    "Please fill out this form with your roommate preferences.\n" +
    "Download this template, convert it to .docx, fill it in Word, and upload it back."
  page.drawText(intro, {
    x: 50,
    y,
    size: 12,
    font,
    color: rgb(0, 0, 0),
    maxWidth: 500,
    lineHeight: 14,
  })
  y -= 70

  // ===== Personal Info Heading =====
  page.drawText("Personal Information", {
    x: 50,
    y,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0.8),
  })
  y -= 30

  // ===== Fields =====
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

  y -= 30

  // ===== Field Descriptions =====
  page.drawText("Field Descriptions", {
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
      lineHeight: 13,
    })
    y -= 20
  })

  y -= 30

  // ===== Instructions Section =====
  page.drawText("Instructions", {
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

  // ===== Save & Download PDF =====
  const pdfBytes = await pdfDoc.save()
  // @ts-expect-error: Blob constructor type inference issue with Uint8Array
  const blob = new Blob([pdfBytes], { type: "application/pdf" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = "roommate_preference_template.pdf"
  link.click()
}
