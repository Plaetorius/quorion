import Link from "next/link"
import Image from "next/image"
import { Github, Linkedin, Mail, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full py-12 md:py-16 border-t border-border/40 backdrop-blur-lg bg-background/50 circuit-bg">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image src="/images/logo.png" alt="Quorion Logo" fill className="object-contain" />
              </div>
              <span className="text-xl font-bold text-gradient">Quorion</span>
            </div>

            <p className="text-muted-foreground max-w-md mb-6">
              A secure Web3 marketplace for health data, empowering research while protecting privacy and ensuring fair
              compensation for contributors.
            </p>

            <div className="flex gap-5">
              <Link href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                <Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="mailto:info@quorion.io" aria-label="Email">
                <Mail className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link href="/project/new" className="text-muted-foreground hover:text-primary transition-colors">
                  Create Project
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic space-y-3">
              <p className="text-muted-foreground">
                Quorion Health Data, Inc.
                <br />
                123 Blockchain Avenue
                <br />
                San Francisco, CA 94105
              </p>
              <p>
                <Link
                  href="mailto:info@quorion.io"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  info@quorion.io
                </Link>
              </p>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Quorion. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

