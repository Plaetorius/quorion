import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quorion | Web3 Health Data Marketplace",
  description: "A secure marketplace for health data powered by Web3 technology",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col bg-gradient-to-br from-quorion-base via-quorion-surface to-quorion-violet/30">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ToastContainer position="top-right" theme="dark" />
        </ThemeProvider>
      </body>
    </html>
  )
}

