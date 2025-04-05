"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Search, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "backdrop-blur-xl bg-background/80 border-b border-border/40 py-2" : "bg-transparent py-4",
      )}
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <Image src="/images/logo.png" alt="Quorion Logo" fill className="object-contain" priority />
            </div>
            <span className="hidden sm:inline-block text-xl font-bold text-gradient">Quorion</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 ml-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href))

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors relative group",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                      isActive ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  ></span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Search button */}
          <button className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
            <Bell className="h-5 w-5" />
          </button>

          {/* User menu */}
          <button className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
            <User className="h-5 w-5" />
          </button>

          {/* Login button */}
          <Link href="/login" className="hidden md:block">
            <Button variant="primary" size="default" className="whitespace-nowrap pulse-glow">
              Login
            </Button>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted/50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu - improved with animations */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md md:hidden bg-background/95 backdrop-blur-xl border-t border-border/40 transition-all duration-300 ease-in-out",
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none",
        )}
      >
        <div className="relative z-20 grid gap-6 p-4 rounded-xl glass-card">
          <nav className="grid grid-flow-row auto-rows-max text-center">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href))

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-center py-3 text-lg font-medium transition-all",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href="/login"
              className="flex items-center justify-center py-3 mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button variant="primary" className="w-full">
                Login
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

