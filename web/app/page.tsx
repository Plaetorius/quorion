import Link from "next/link"
import { ArrowRight, Shield, Lock, Database, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProjectCard from "@/components/project-card"
import { projects } from "@/data/projects"

export default function Home() {
  // Get featured projects
  const featuredProjects = projects.slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Enhanced Visual Design */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-quorion-base via-quorion-surface to-quorion-violet/20 circuit-bg"></div>
        <div className="absolute inset-0 hero-gradient" />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 animate-pulse-slow"></div>
          <div
            className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-accent/5 animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-secondary/5 animate-pulse-slow"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Secure Web3 Health Data Marketplace
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gradient text-shadow-lg animate-float">
            Quorion
          </h1>

          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-foreground/90">
            Revolutionizing health data sharing with blockchain technology while protecting privacy and rewarding
            contributors.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default" className="whitespace-nowrap pulse-glow" asChild>
              <Link href="/projects" className="flex items-center">
                <span>Explore Projects</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="whitespace-nowrap" asChild>
              <Link href="/about">Learn How It Works</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <Shield className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm text-muted-foreground">HIPAA Compliant</span>
            </div>
            <div className="flex flex-col items-center">
              <Lock className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm text-muted-foreground">End-to-End Encrypted</span>
            </div>
            <div className="flex flex-col items-center">
              <Database className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm text-muted-foreground">Decentralized Storage</span>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm text-muted-foreground">Fair Compensation</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Featured Projects Section - Enhanced */}
      <section className="py-20 container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-3">Featured Projects</h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover groundbreaking health data initiatives that are shaping the future of medicine and research.
            </p>
          </div>
          <Link href="/projects" className="mt-4 md:mt-0">
            <Button variant="outline" size="lg" className="whitespace-nowrap group">
              <span>View All Projects</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} featured={index === 0} />
          ))}
        </div>
      </section>

      {/* How It Works Section - New */}
      <section className="py-20 bg-muted/5 backdrop-blur-sm">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Quorion Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform connects health data contributors with researchers through a secure, transparent blockchain
              ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Contribute Data</h3>
              <p className="text-muted-foreground">
                Securely share your health data through our encrypted platform with full control over your information.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Verification</h3>
              <p className="text-muted-foreground">
                Data is anonymized and verified by our network of validators to ensure quality and compliance.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Research Access</h3>
              <p className="text-muted-foreground">
                Researchers access anonymized data sets through smart contracts with transparent usage tracking.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Receive Rewards</h3>
              <p className="text-muted-foreground">
                Contributors are automatically compensated through blockchain payments when their data is utilized.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="py-20 bg-accent/5 backdrop-blur-sm circuit-bg">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-16">Transforming Health Data</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center glass-card p-8 rounded-xl animate-pulse-glow">
              <p className="text-4xl font-bold text-gradient">$1.5M+</p>
              <p className="text-sm text-muted-foreground mt-3">Distributed to Contributors</p>
            </div>
            <div className="text-center glass-card p-8 rounded-xl animate-pulse-glow">
              <p className="text-4xl font-bold text-gradient">50+</p>
              <p className="text-sm text-muted-foreground mt-3">Active Research Projects</p>
            </div>
            <div className="text-center glass-card p-8 rounded-xl animate-pulse-glow">
              <p className="text-4xl font-bold text-gradient">10K+</p>
              <p className="text-sm text-muted-foreground mt-3">Data Contributors</p>
            </div>
            <div className="text-center glass-card p-8 rounded-xl animate-pulse-glow">
              <p className="text-4xl font-bold text-gradient">100%</p>
              <p className="text-sm text-muted-foreground mt-3">Secure & Encrypted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - New */}
      <section className="py-20 container">
        <h2 className="text-3xl font-bold text-center mb-16">What Our Users Say</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                <span className="text-lg font-bold text-primary">JD</span>
              </div>
              <div>
                <h4 className="font-medium">Dr. Jane Doe</h4>
                <p className="text-sm text-muted-foreground">Research Scientist</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              &ldquo;Quorion has revolutionized how we access health data for our research. The quality and diversity of the
              data sets have accelerated our progress significantly.&rdquo;
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                <span className="text-lg font-bold text-primary">MS</span>
              </div>
              <div>
                <h4 className="font-medium">Michael Smith</h4>
                <p className="text-sm text-muted-foreground">Data Contributor</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              &ldquo;I love that I can contribute to medical research while maintaining my privacy. The compensation is fair
              and the process is incredibly simple.&rdquo;
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                <span className="text-lg font-bold text-primary">AJ</span>
              </div>
              <div>
                <h4 className="font-medium">Dr. Alex Johnson</h4>
                <p className="text-sm text-muted-foreground">Healthcare Provider</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              &ldquo;The blockchain verification system ensures we&apos;re working with reliable data. This platform bridges the
              gap between patients, researchers, and healthcare providers.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 container text-center">
        <div className="max-w-3xl mx-auto glass-card p-12 rounded-xl pulse-glow">
          <h2 className="text-3xl font-bold mb-4">Ready to Contribute?</h2>
          <p className="text-muted-foreground mb-8">
            Join our community of researchers, healthcare providers, and data contributors to accelerate medical
            breakthroughs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default" className="whitespace-nowrap pulse-glow" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="whitespace-nowrap" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

