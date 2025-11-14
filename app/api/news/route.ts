import { NextResponse } from 'next/server'

interface NewsItem {
  title: string
  description?: string
  source: string
  url: string
  published_at: string
  image_url?: string
}

/**
 * Fetches crypto news from CoinGecko's news API
 */
async function getCryptoNews(term: string): Promise<NewsItem[]> {
  try {
    // CoinGecko Trending/News endpoint
    const response = await fetch('https://api.coingecko.com/api/v3/news', {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch news from CoinGecko')
    }

    const newsData = await response.json()

    // Filter news items by the search term (case-insensitive)
    const filteredNews = (newsData.data || [])
      .filter((item: any) => {
        const titleLower = item.title?.toLowerCase() || ''
        const descLower = item.description?.toLowerCase() || ''
        const termLower = term.toLowerCase()
        return titleLower.includes(termLower) || descLower.includes(termLower)
      })
      .slice(0, 5) // Get top 5 matching news items
      .map((item: any) => ({
        title: item.title || 'Untitled',
        description: item.description || '',
        source: item.source?.name || 'CoinGecko',
        url: item.url || '#',
        published_at: item.published_at || new Date().toISOString(),
        image_url: item.image_url || null,
      }))

    return filteredNews
  } catch (error) {
    console.error('News API Error:', error)
    return [] // Return empty array on error rather than failing
  }
}

/**
 * POST handler for news requests
 */
export async function POST(request: Request) {
  try {
    const { term } = await request.json()

    if (!term) {
      return NextResponse.json({ error: 'Term is required' }, { status: 400 })
    }

    const news = await getCryptoNews(term)

    return NextResponse.json({ news, count: news.length })
  } catch (error) {
    console.error('Server Error:', error)
    return NextResponse.json({ error: 'Server Error', news: [] }, { status: 500 })
  }
}
