import { NextResponse } from 'next/server'

// Configuration
const HF_API_URL = "https://api-inference.huggingface.co/models/SentientAGI/Dobby-Mini-Unhinged-Llama-3.1-8B"

/**
 * Fetches Dobby's explanation from Hugging Face
 */
async function getDobbyExplanation(term: string, apiKey: string) {
  const prompt = `
    You are 'Dobby', a blunt and insightful crypto expert.
    Explain the term '${term}' in simple terms.
    Be professional but keep your blunt "Dobby-style" personality.
    ABSOLUTELY NO profanity.
    Your explanation should be a single, concise paragraph.
    EXPLANATION:
  `

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      // return_full_text: false makes it only return the new text
      body: JSON.stringify({ 
        inputs: prompt, 
        parameters: { max_new_tokens: 256, return_full_text: false } 
      }),
    })

    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || "AI model is loading or unavailable.")
    }

    if (Array.isArray(result)) {
      return result[0]?.generated_text?.trim() || "Dobby is silent."
    }
    return result?.generated_text || "Dobby is analyzing..."
  } catch (error: any) {
    console.error("AI Error:", error)
    return `Dobby is currently offline. (${error.message})`
  }
}

/**
 * Fetches market data from CoinGecko
 */
async function getCoinGeckoData(term: string) {
  try {
    // 1. Search for Coin ID
    const searchRes = await fetch(`https://api.coingecko.com/api/v3/search?query=${term}`)
    const searchData = await searchRes.json()
    
    // Check for categories if no coins are found (e.g., "DeFi", "Layer 2")
    if (!searchData.coins || searchData.coins.length === 0) {
      if (searchData.categories && searchData.categories.length > 0) {
        return { categories: searchData.categories.slice(0, 3).map((cat: any) => cat.name) }
      }
      return { error: "Term not found on CoinGecko." }
    }
    
    const coinId = searchData.coins[0].id

    // 2. Get Price Data
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
 * The main POST handler for /api/analyze
 */
export async function POST(request: Request) {
  try {
    const { term } = await request.json()
    const apiKey = process.env.HUGGING_FACE_API_KEY

    if (!term) {
      return NextResponse.json({ error: "Term is required" }, { status: 400 })
    }
    if (!apiKey) {
      return NextResponse.json({ error: "Server API Key missing" }, { status: 500 })
    }

    // Run both fetches in parallel
    const [dobbyTake, marketData] = await Promise.all([
      getDobbyExplanation(term, apiKey),
      getCoinGeckoData(term)
    ])

    return NextResponse.json({ dobbyTake, marketData })

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}