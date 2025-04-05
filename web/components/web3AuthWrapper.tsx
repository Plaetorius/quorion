/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { CHAIN_NAMESPACES, IAdapter, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal"
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter"
import LoggedInView from './loggedInView'
import Console from './console'

// Dashboard Registration
const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"
const chainId = "0x9f8" // Bahamut Testnet (2552 in decimal)

// Chain Config
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: chainId, 
  rpcTarget: "https://rpc1-horizon.bahamut.io",
  displayName: "Bahamut Testnet",
  blockExplorerUrl: "https://horizon.ftnscan.com",
  ticker: "FTN",
  tickerName: "Bahamut",
  logo: "https://horizon.ftnscan.com/images/logo.png",
}

export default function Web3AuthWrapper() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null)
  const [provider, setProvider] = useState<IProvider | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState<any>(null)

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
    }
  }

  const getUserInfo = async () => {
    if (!web3auth) {
      setConsoleOutput("web3auth not initialized yet")
      return
    }
    const user = await web3auth.getUserInfo()
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
    <div className="container">
      <h1 className="title">
        <a 
          target="_blank" 
          href="https://web3auth.io/docs/sdk/pnp/web/modal" 
          rel="noreferrer"
        >
          Web3Auth{" "}
        </a>
        & Next.js App Router
      </h1>

      <div className="grid">
        {loggedIn ? (
          <LoggedInView 
            provider={provider} 
            logoutAction={logout} 
            getUserInfoAction={getUserInfo}
            setConsoleOutputAction={setConsoleOutput}
          />
        ) : (
          <button onClick={login} className="card">
            Login
          </button>
        )}
      </div>

      <Console output={consoleOutput} />

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/quick-starts/react-modal-quick-start"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  )
}