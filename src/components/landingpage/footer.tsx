// components/Footer.tsx
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6 mt-12">
      <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        {/* Left - Brand / Copyright */}
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} Room Matcher AI. All rights reserved.
        </p>

        {/* Right - Navigation */}
        <nav className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-foreground transition">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-foreground transition">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  )
}
