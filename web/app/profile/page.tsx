"use client"

import { useWeb3Auth } from "@/contexts/web3AuthContext"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function UserProfile() {
  const { 
    isLoggedIn, 
    userInfo, 
    logout, 
    getAccounts, 
    getBalance 
  } = useWeb3Auth()
  
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

  const fetchAccountDetails = async () => {
    try {
      const address = await getAccounts()
      setWalletAddress(address)
      
      const balanceValue = await getBalance()
      setBalance(balanceValue)
    } catch (error) {
      console.error("Error fetching account details:", error)
    }
  }

  if (!isLoggedIn) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please login to view your profile</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userInfo && (
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-center">
              {userInfo.name || "Anonymous User"}
            </h3>
            {userInfo.email && (
              <p className="text-center text-muted-foreground">
                {userInfo.email}
              </p>
            )}
            <p className="text-center text-sm text-muted-foreground">
              Login method: {userInfo.typeOfLogin || "Unknown"}
            </p>
          </div>
        )}
        
        <div className="border-t pt-4 mt-4">
          <h4 className="text-lg font-medium mb-4">Wallet Information</h4>
          
          {!walletAddress ? (
            <Button onClick={fetchAccountDetails} className="w-full">
              Load Wallet Details
            </Button>
          ) : (
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Wallet Address:</p>
                <p className="font-mono text-sm break-all">{walletAddress}</p>
              </div>
              
              {balance && (
                <div>
                  <p className="text-sm text-muted-foreground">Balance:</p>
                  <p className="font-medium">{balance}</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <Button onClick={logout} variant="destructive" className="w-full mt-4">
          Logout
        </Button>
      </CardContent>
    </Card>
  )
}