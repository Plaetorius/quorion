/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Link from "next/link"
import { ArrowLeft, Github, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'
import { CHAIN_NAMESPACES, IAdapter, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal"
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter"
import { useRouter } from "next/navigation"

// Dashboard Registration
const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"
const chainId = "0x142d" // Bahamut Mainnet (5165 in decimal)

// Chain Config
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: chainId, 
  rpcTarget: "https://rpc1.bahamut.io",
  displayName: "Bahamut Mainnet",
  blockExplorerUrl: "https://ftnscan.com/",
  ticker: "FTN",
  tickerName: "Bahamut",
  logo: "https://horizon.ftnscan.com/images/logo.png",
}

export default function LoginPage() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null)
  const [provider, setProvider] = useState<IProvider | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      try {
        // SDK Initialization
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        })

        const web3AuthOptions: Web3AuthOptions = {
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
          privateKeyProvider,
        }

        const web3authInstance = new Web3Auth(web3AuthOptions)
        
        // Configure External Wallets
        const adapters = getDefaultExternalAdapters({ options: web3AuthOptions })
        adapters.forEach((adapter: IAdapter<unknown>) => {
          web3authInstance.configureAdapter(adapter)
        })

        setWeb3auth(web3authInstance)
        
        await web3authInstance.initModal()
        setProvider(web3authInstance.provider)

        if (web3authInstance.connected) {
          setLoggedIn(true)
        }
      } catch (error) {
        console.error(error)
      }
    }

    init()
  }, [])
  
  const login = async () => {
    if (!web3auth) {
      setConsoleOutput("web3auth not initialized yet")
      return
    }
    const web3authProvider = await web3auth.connect()
    setProvider(web3authProvider)
    if (web3auth.connected) {
      setLoggedIn(true)
      router.push("/")
    }
  }

  const getUserInfo = async () => {
    if (!web3auth) {
      setConsoleOutput("web3auth not initialized yet")
      return
    }
    const user = await web3auth.getUserInfo()
    console.log(user)
    setConsoleOutput(user)
  }

  const logout = async () => {
    if (!web3auth) {
      setConsoleOutput("web3auth not initialized yet")
      return
    }
    await web3auth.logout()
    setProvider(null)
    setLoggedIn(false)
    setConsoleOutput("logged out")
  }

  if (!web3auth) {
    return <div>Loading...</div>
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
            <p className="text-muted-foreground">Sign in to access the secure health data marketplace</p>
          </div>

          <div className="space-y-4">
            <Button className="w-full flex items-center justify-center gap-2" variant="outline" onClick={login}> 
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

            <Button className="w-full" variant="default">
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
        <div>
          <Button onClick={getUserInfo}>
            GetUserInfo
          </Button>
        </div>
        <div>
          <Button onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

