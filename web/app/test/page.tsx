'use client'

import dynamic from 'next/dynamic'

// Dynamically import the Web3AuthWrapper with no SSR
const Web3AuthWrapper = dynamic(
  () => import('@/components/web3AuthWrapper'),
  { ssr: false }
)

export default function Home() {
  return <Web3AuthWrapper />
}