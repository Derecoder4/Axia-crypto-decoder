import { NextResponse } from 'next/server'

// Define the Fireworks API URL
const FIREWORKS_API_URL = "https://api.fireworks.ai/inference/v1/chat/completions"

/**
 * Fetches Dobby's explanation from Fireworks AI
 */
async function getDobbyExplanation(term: string, apiKey: string) {
  
  // This is the "system prompt" that defines Dobby's personality
  const systemPrompt = `
    You are 'Dobby', a blunt and insightful crypto expert.
    Explain the term in simple terms.
    Be professional but keep your blunt "Dobby-style" personality.
    ABSOLUTELY NO profanity.
    Your explanation should be a single, concise paragraph.
    EXPLANATION:
  `

  try {
    const response = await fetch(FIREWORKS_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`, // Use the Fireworks key
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        // The "Unhinged Plus" model you found
        model: "accounts/sentientfoundation-serverless/models/dobby-mini-unhinged-plus-llama-3-1-8b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Explain the term: '${term}'` }
        ],
        max_tokens: 256,
        temperature: 0.7,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      // Pass the specific error from Fireworks
      throw new Error(result.error?.message || result.message || "Fireworks API error")
    }

    // Get the AI's message from the response
    return result.choices[0].message?.content?.trim() || "Dobby is speechless."

  } catch (error: any) {
    console.error("AI Error:", error)
    return `Dobby is currently offline. (${error.message})`
  }
}

/**
 * Fetches market data from CoinGecko (This function stays the same)
 */
async function getCoinGeckoData(term: string) {
  try {
    const searchRes = await fetch(`https://api.coingecko.com/api/v3/search?query=${term}`)
    const searchData = await searchRes.json()
    
    if (!searchData.coins || searchData.coins.length === 0) {
      if (searchData.categories && searchData.categories.length > 0) {
        return { categories: searchData.categories.slice(0, 3).map((cat: any) => cat.name) }
      }
      return { error: "Term not found on CoinGecko." }
    }
    
    const coinId = searchData.coins[0].id
    const dataRes = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
    const coinData = await dataRes.json()

    return {
      name: coinData.name,
      symbol: coinData.symbol?.toUpperCase(),
      price: coinData.market_data?.current_price?.usd || 0,
      change_24h_percent: coinData.market_data?.price_change_percentage_24h || 0,
      market_cap: coinData.market_data?.market_cap?.usd?.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact'
      }) || "N/A",
    }
  } catch (error) {
    console.error("CoinGecko Error:", error)
    return { error: "Failed to fetch market data." }
  }
}

/**
 * The main POST handler
 * This now uses the FIREWORKS_API_KEY
 */
export async function POST(request: Request) {
  try {
    const { term } = await request.json()
    // Read the Fireworks key
    const apiKey = process.env.FIREWORKS_API_KEY

    if (!term) {
      return NextResponse.json({ error: "Term is required" }, { status: 400 })
    }
    if (!apiKey) {
      return NextResponse.json({ error: "Server API Key for Fireworks missing" }, { status: 500 })
    }

    // Run both fetches in parallel
    const [dobbyTake, marketData] = await Promise.all([
      getDobbyExplanation(term, apiKey), // Pass the new key
      getCoinGeckoData(term)
    ])

    return NextResponse.json({ dobbyTake, marketData })

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}