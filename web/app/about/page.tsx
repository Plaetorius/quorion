import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient glow-text">About Quorion</h1>
      <p className="text-xl text-muted-foreground mb-12 max-w-3xl">
        Revolutionizing health data sharing with Web3 technology, ensuring privacy, security, and fair compensation.
      </p>

      <div className="grid gap-16">
        {/* How It Works Section */}
        <section>
          <h2 className="text-2xl font-bold mb-8">How It Works</h2>

          <div className="relative">
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-primary/30 -translate-x-1/2 z-0 pulse-glow"></div>

            <div className="grid gap-12 relative z-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <div className="glass-card rounded-xl p-6 border-flow">
                    <h3 className="text-xl font-semibold mb-4 text-gradient">Data Collection</h3>
                    <p className="text-muted-foreground mb-4">
                      Contributors securely submit their health data through our encrypted platform. All data is
                      anonymized and verified before being added to the marketplace.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>End-to-end encryption ensures data privacy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>Anonymization protocols protect personal identities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>Multi-level validation ensures data quality</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="order-1 md:order-2 flex justify-center">
                  <div className="relative w-64 h-64 rounded-full bg-accent/20 flex items-center justify-center pulse-glow">
                    <div className="relative w-48 h-48">
                      <Image src="/images/data-collection.svg" alt="Data Collection" fill className="animate-float" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center">
                  <div className="relative w-64 h-64 rounded-full bg-accent/20 flex items-center justify-center pulse-glow">
                    <div className="relative w-48 h-48">
                      <Image src="/images/data-storage.svg" alt="Data Storage" fill className="animate-float" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="glass-card rounded-xl p-6 border-flow">
                    <h3 className="text-xl font-semibold mb-4 text-gradient">Secure Storage</h3>
                    <p className="text-muted-foreground mb-4">
                      All data is stored on a decentralized network using advanced encryption. Smart contracts ensure
                      that data access is controlled and transparent.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>Decentralized storage prevents single points of failure</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>Military-grade encryption protects sensitive information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>Immutable blockchain records maintain data integrity</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <div className="glass-card rounded-xl p-6 border-flow">
                    <h3 className="text-xl font-semibold mb-4 text-gradient">Data Marketplace</h3>
                    <p className="text-muted-foreground mb-4">
                      Researchers and healthcare organizations can purchase access to anonymized data sets. Smart
                      contracts ensure fair pricing and transparent transactions.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>Transparent pricing models benefit all stakeholders</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>Customizable data sets for specific research needs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>Compliance with global health data regulations</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="order-1 md:order-2 flex justify-center">
                  <div className="relative w-64 h-64 rounded-full bg-accent/20 flex items-center justify-center pulse-glow">
                    <div className="relative w-48 h-48">
                      <Image src="/images/data-marketplace.svg" alt="Data Marketplace" fill className="animate-float" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center">
                  <div className="relative w-64 h-64 rounded-full bg-accent/20 flex items-center justify-center pulse-glow">
                    <div className="relative w-48 h-48">
                      <Image src="/images/rewards.svg" alt="Contributor Rewards" fill className="animate-float" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="glass-card rounded-xl p-6 border-flow">
                    <h3 className="text-xl font-semibold mb-4 text-gradient">Contributor Rewards</h3>
                    <p className="text-muted-foreground mb-4">
                      Data contributors receive fair compensation through automated smart contracts. Payments are
                      processed securely and transparently on the blockchain.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>Automatic payments triggered by data usage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>Fair compensation based on data value and usage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>Multiple payout options including crypto and fiat</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack Section */}
        <section className="glass-card rounded-xl p-8 border-flow">
          <h2 className="text-2xl font-bold mb-8 text-gradient">Our Technology</h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">Web3 Infrastructure</h3>
              <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4 pulse-glow">
                <Image src="/images/web3-infrastructure.jpg" alt="Web3 Infrastructure" fill className="object-cover" />
              </div>
              <p className="text-muted-foreground">
                Our platform is built on cutting-edge Web3 technologies, including blockchain, smart contracts, and
                decentralized storage. This ensures maximum security, transparency, and control for all participants.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Privacy & Security</h3>
              <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4 pulse-glow">
                <Image src="/images/privacy-security.jpg" alt="Privacy and Security" fill className="object-cover" />
              </div>
              <p className="text-muted-foreground">
                We implement zero-knowledge proofs, homomorphic encryption, and secure multi-party computation to ensure
                that sensitive health data remains private while still being useful for research and analysis.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section>
          <h2 className="text-2xl font-bold mb-8 text-gradient">Benefits for All Stakeholders</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-flow">
              <h3 className="text-xl font-semibold mb-4">For Contributors</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Fair compensation for your valuable health data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Complete privacy and control over your information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Contribute to advancing medical research</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Transparent tracking of how your data is used</span>
                </li>
              </ul>
            </div>

            <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-flow">
              <h3 className="text-xl font-semibold mb-4">For Researchers</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Access to high-quality, verified health data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Customizable data sets for specific research needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Compliance with regulatory requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Streamlined procurement process</span>
                </li>
              </ul>
            </div>

            <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-flow">
              <h3 className="text-xl font-semibold mb-4">For Healthcare</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Accelerate development of new treatments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Improve patient outcomes through data-driven insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Reduce costs of data acquisition and management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Build trust through transparent data practices</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center glass-card rounded-xl p-10">
          <h2 className="text-2xl font-bold mb-4 text-gradient">Ready to Join the Health Data Revolution?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're a data contributor, researcher, or healthcare organization, Quorion provides the secure
            platform you need to participate in the future of health data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" variant="action" className="whitespace-nowrap" asChild>
              <Link href="/projects" className="flex items-center">
                <span>Explore Projects</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="action-outline" className="whitespace-nowrap" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

