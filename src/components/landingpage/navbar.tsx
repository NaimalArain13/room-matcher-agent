// components/Navbar.tsx
import Link from "next/link"

export default function Navbar() {
  return (
    <header className="w-full border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="text-xl font-bold text-primary hover:opacity-80 transition">
          Room Matcher AI
        </Link>
      </div>
    </header>
  )
}
