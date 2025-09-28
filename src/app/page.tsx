import Navbar from "@/components/landingpage/navbar"
import Hero from "@/components/landingpage/hero"
import Footer from "@/components/landingpage/footer"

export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow">
        <Hero />
      </div>
      <Footer />
    </main>
  )
}
