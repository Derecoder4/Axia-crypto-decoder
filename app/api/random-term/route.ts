import { NextResponse } from 'next/server'

// Using the same trending terms from your page.tsx
const TRENDING_TERMS = [
  "Bitcoin (BTC)",
  "Ethereum (ETH)",
  "DeFi",
  "NFT",
  "Blockchain",
  "Smart Contract",
  "Altcoin",
  "Stablecoin",
  "Mining",
  "Staking",
  "DAO",
  "Web3",
  "Layer 2",
  "ZK-Rollup",
  "MEV",
  "Impermanent Loss",
  "Yield Farming",
  "Rug Pull",
  "Tokenomics",
  "Gas Fees",
]

export async function GET() {
  try {
    const randomIndex = Math.floor(Math.random() * TRENDING_TERMS.length)
    const randomTerm = TRENDING_TERMS[randomIndex]
    
    return NextResponse.json({ term: randomTerm })
  } catch (error) {
    return NextResponse.json({ error: "Failed to get random term" }, { status: 500 })
  }
}