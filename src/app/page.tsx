import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-background">
      <header className="w-full border-b">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-semibold text-primary text-balance">Room Matcher AI</div>
          <nav className="flex items-center gap-3">
            <Link href="/match" className="text-sm text-muted-foreground hover:text-foreground">
              Start Matching
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-pretty">
              Smarter student living — find compatible roommates & rooms.
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Upload your completed profile template, preview the parsed details, and see ranked matches with clear
              explanations and wingman advice.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="/static/profile_template.docx" download className="inline-flex">
                <Button variant="default">Download profile template</Button>
              </a>
              <Link href="/match" className="inline-flex">
                <Button variant="secondary">Start Matching</Button>
              </Link>
            </div>
          </div>

          <Card className="bg-card">
            <CardContent className="p-6">
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>Mobile-first, accessible UI</li>
                <li>File upload with progress + parsing preview</li>
                <li>Agent stepper: Profile Reader → Match Scorer → Red Flag → Wingman</li>
                <li>Results with scores, red flags, and wingman advice</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
