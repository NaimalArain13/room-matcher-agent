// components/Hero.tsx
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Hero() {
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
            <a href="/static/profile_template.docx" download>
              <Button size="lg">Download Profile Template</Button>
            </a>
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
