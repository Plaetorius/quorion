"use client"

import Link from "next/link"
import { ArrowLeft, Github, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWeb3Auth } from "@/contexts/web3AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { 
    isLoading, 
    isLoggedIn, 
    login, 
    getUserInfo, 
    logout 
  } = useWeb3Auth();
  
  const router = useRouter()

  // If already logged in, redirect to home
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/")
    }
  }, [isLoggedIn, router])

  if (isLoading) {
    return <div>Loading authentication system...</div>
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-16rem)] py-8">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="glass-card rounded-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome to Quorion</h1>
            <p className="text-muted-foreground">Sign in to access the decentralized health data marketplace</p>
          </div>

          <div className="space-y-4">
            <Button 
              className="w-full flex items-center justify-center gap-2" 
              variant="outline" 
              onClick={login}
            > 
              <Mail className="h-5 w-5" />
              Continue with Google Account
            </Button>

            <Button className="w-full flex items-center justify-center gap-2" variant="outline">
              <Github className="h-5 w-5" />
              Continue with GitHub
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button 
              className="w-full" 
              variant="default"
              onClick={login}
            >
              Connect Wallet
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-6">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}