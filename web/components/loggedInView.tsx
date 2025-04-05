/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { IProvider } from '@web3auth/base'
import RPC from '../lib/ethersRPC'

interface LoggedInViewProps {
  provider: IProvider | null
  logoutAction: () => Promise<void>
  getUserInfoAction: () => Promise<void>
  setConsoleOutputAction: (output: any) => void
}

export default function LoggedInView({ provider, logoutAction, getUserInfoAction, setConsoleOutputAction }: LoggedInViewProps) {
  const uiConsole = (...args: any[]): void => {
    setConsoleOutputAction(args || {})
    console.log(...args)
  }

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet")
      return
    }
    const address = await RPC.getAccounts(provider)
    uiConsole(address)
  }

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet")
      return
    }
    const balance = await RPC.getBalance(provider)
    uiConsole(balance)
  }

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet")
      return
    }
    const signedMessage = await RPC.signMessage(provider)
    uiConsole(signedMessage)
  }

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet")
      return
    }
    uiConsole("Sending Transaction...")
    const transactionReceipt = await RPC.sendTransaction(provider)
    uiConsole(transactionReceipt)
  }

  return (
    <div className="flex-container">
      <div>
        <button onClick={getUserInfoAction} className="card">
          Get User Info
        </button>
      </div>
      <div>
        <button onClick={getAccounts} className="card">
          Get Accounts
        </button>
      </div>
      <div>
        <button onClick={getBalance} className="card">
          Get Balance
        </button>
      </div>
      <div>
        <button onClick={signMessage} className="card">
          Sign Message
        </button>
      </div>
      <div>
        <button onClick={sendTransaction} className="card">
          Send Transaction
        </button>
      </div>
      <div>
        <button onClick={logoutAction} className="card">
          Log Out
        </button>
      </div>
    </div>
  )
}