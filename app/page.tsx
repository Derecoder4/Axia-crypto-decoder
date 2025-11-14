"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Loader2, Heart, Share2 } from "lucide-react"
import { Navbar } from "@/components/navbar"

// Responsive helper hook
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [matches, query])

  return matches
}

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

interface MarketData {
  symbol?: string
  name?: string
  price?: number
  change_24h_percent?: number
  market_cap?: string
  categories?: string[]
  error?: string
}

interface CryptoResult {
  dobbyTake: string
  marketData: MarketData
}

const formatPrice = (price: number | undefined): string => {
  if (price === undefined) return "N/A"
  return price.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function Home() {
  const [term, setTerm] = useState<string>("")
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CryptoResult | null>(null)
  const [showHistory, setShowHistory] = useState<boolean>(false)
  const [favorites, setFavorites] = useState<string[]>([])

  // Responsive breakpoints
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")
  const isDesktop = useMediaQuery("(min-width: 1025px)")

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("cryptoDobbyFavorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cryptoDobbyFavorites", JSON.stringify(favorites))
  }, [favorites])

  const handleAnalyze = useCallback(
    async (e?: React.MouseEvent, prefilledTerm?: string) => {
      e?.preventDefault()
      const searchTerm = prefilledTerm || term.trim()
      if (!searchTerm) return

      setIsLoading(true)
      setError(null)
      setResult(null)

      // Add to search history if not already present
      if (!searchHistory.includes(searchTerm)) {
        setSearchHistory([searchTerm, ...searchHistory.slice(0, 4)]) // Keep last 5
      }

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ term: searchTerm }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "An error occurred")
        }

        setResult(data)
        setTerm("") // Clear input after successful analysis
        setShowHistory(false) // Hide history after analysis
      } catch (err: any) {
        setError(err.message || "Failed to analyze term. Please try again.")
        setResult(null) // Ensure no stale results are shown
      } finally {
        setIsLoading(false)
      }
    },
    [term, searchHistory],
  )

  const handleRandomTerm = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/random-term")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to get a random term.")
      }

      const randomTerm = data.term
      setTerm(randomTerm) // Set the random term in the input
      // Optionally, auto-analyze the random term
      handleAnalyze(undefined, randomTerm)
    } catch (err: any) {
      setError(err.message || "Failed to get a random term. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [handleAnalyze])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAnalyze()
    }
  }

  const toggleFavorite = () => {
    if (term && result?.dobbyTake) {
      setFavorites((prev) => {
        if (prev.includes(term)) {
          return prev.filter((fav) => fav !== term)
        } else {
          return [...prev, term]
        }
      })
    } else if (result?.marketData.name) {
      // Handle favoriting based on market data name if no term is set
      setFavorites((prev) => {
        if (prev.includes(result.marketData.name!)) {
          return prev.filter((fav) => fav !== result.marketData.name!)
        } else {
          return [...prev, result.marketData.name!]
        }
      })
    }
  }

  const handleShare = () => {
    if (result) {
      const shareText = `Check out this crypto term: "${term}"\n\nDobby's Take: ${result.dobbyTake}\n\nLink: ${window.location.href}`
      navigator.clipboard
        .writeText(shareText)
        .then(() => alert("Copied to clipboard!"))
        .catch((err) => console.error("Failed to copy text: ", err))
    }
  }

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #232323 0%, #121212 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar onRandomTerm={handleRandomTerm} />

      {/* Main Container */}
      <main
        style={{
          flex: 1,
          padding: isMobile ? "1rem" : isTablet ? "1.25rem" : "2rem 1.5rem",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          animation: "fadeIn 0.6s ease-out",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isDesktop ? "1fr 280px" : "1fr",
            gap: isDesktop ? "2rem" : "1.5rem",
            alignItems: "start",
          }}
        >
          {/* Main Content */}
          <div>
            {/* Headings */}
            <h1
              style={{
                fontSize: isMobile ? "1.5rem" : isTablet ? "1.875rem" : "2.5rem",
                fontWeight: 700,
                color: "#e0e0e0",
                margin: "0 0 0.5rem 0",
                lineHeight: "1.2",
                animation: "slideUp 0.5s ease-out",
              }}
            >
              Decode Crypto.
            </h1>
            <p
              style={{
                fontSize: isMobile ? "0.95rem" : "1.1rem",
                color: "#aaa",
                margin: "0 0 2rem 0",
                lineHeight: "1.6",
                animation: "slideUp 0.5s ease-out 0.1s backwards",
              }}
            >
              Get a blunt explanation and live data for any crypto term.
            </p>

            {/* Search Box */}
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: "0.75rem",
                marginBottom: "2rem",
                animation: "slideUp 0.5s ease-out 0.2s backwards",
              }}
            >
              <div style={{ flex: 1, position: "relative" }}>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                    onFocus={(e) => {
                      setShowHistory(true)
                      e.currentTarget.style.borderColor = "#E63995"
                      e.currentTarget.style.boxShadow = "0 0 10px rgba(230, 57, 149, 0.2)"
                    }}
                    onBlur={(e) => {
                      setTimeout(() => setShowHistory(false), 150)
                      e.currentTarget.style.borderColor = "#333"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  placeholder={isMobile ? "e.g., DeFi, NFT" : "e.g., ZK-Rollup, Impermanent Loss, MEV"}
                  style={{
                    width: "100%",
                    padding: isMobile ? "0.625rem 0.875rem" : "0.75rem 1rem",
                    background: "#222",
                    border: "1px solid #333",
                    borderRadius: "0.5rem",
                    color: "#e0e0e0",
                    fontSize: isMobile ? "0.95rem" : "1rem",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "all 0.3s ease",
                  }}
                />

                {/* Search History Dropdown */}
                {showHistory && searchHistory.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      background: "#1e1e1e",
                      border: "1px solid #333",
                      borderTop: "none",
                      borderRadius: "0 0 0.5rem 0.5rem",
                      maxHeight: "250px",
                      overflowY: "auto",
                      zIndex: 10,
                      animation: "slideUp 0.2s ease-out",
                    }}
                  >
                    {searchHistory.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnalyze(undefined, item)}
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          background: "transparent",
                          border: "none",
                          borderBottom: idx < searchHistory.length - 1 ? "1px solid #333" : "none",
                          color: "#aaa",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "0.95rem",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#222"
                          e.currentTarget.style.color = "#E63995"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent"
                          e.currentTarget.style.color = "#aaa"
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={(e) => handleAnalyze(e)}
                disabled={isLoading}
                style={{
                  padding: isMobile ? "0.625rem 1rem" : "0.75rem 1.5rem",
                  background: "#E63995",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontWeight: 700,
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  whiteSpace: "nowrap",
                  width: isMobile ? "100%" : "auto",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.background = "#d91f7d"
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(230, 57, 149, 0.3)"
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#E63995"
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {isMobile ? "..." : "Analyzing..."}
                  </>
                ) : (
                  isMobile ? "Search" : "Analyze"
                )}
              </button>
            </div>

            {/* Loading Spinner */}
            {isLoading && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "2rem",
                  animation: "fadeIn 0.3s ease-out",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "4px solid #333",
                    borderTop: "4px solid #E63995",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <p style={{ color: "#aaa" }}>Dobby is analyzing...</p>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            )}

            {/* Error Box */}
            {error && (
              <div
                style={{
                  background: "#8B0000",
                  color: "#FF6B6B",
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                  marginBottom: "2rem",
                  fontSize: "0.95rem",
                  animation: "slideUp 0.3s ease-out",
                  border: "1px solid #b30000",
                }}
              >
                {error}
              </div>
            )}

            {/* Result Cards */}
            {result && !isLoading && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Dobby's Take Card */}
                <div
                  style={{
                    background: "#1e1e1e",
                    border: "1px solid #333",
                    borderRadius: "0.5rem",
                    padding: isMobile ? "0.875rem" : isTablet ? "1.25rem" : "1.5rem",
                    animation: "slideUp 0.4s ease-out",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#E63995"
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(230, 57, 149, 0.2)"
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#333"
                    e.currentTarget.style.boxShadow = "none"
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: isMobile ? "flex-start" : "center",
                      marginBottom: "1rem",
                      flexDirection: isMobile ? "column" : "row",
                      gap: isMobile ? "0.75rem" : "0",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: isMobile ? "1.1rem" : "1.25rem",
                        fontWeight: 700,
                        color: "#E63995",
                        margin: 0,
                      }}
                    >
                      Dobby's Take
                    </h2>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={toggleFavorite}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: favorites.includes(term || result.marketData.name || "") ? "#E63995" : "#666",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          padding: 0,
                        }}
                        title="Add to favorites"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.2)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)"
                        }}
                      >
                        <Heart
                          size={20}
                          fill={favorites.includes(term || result.marketData.name || "") ? "currentColor" : "none"}
                          style={{ transition: "transform 0.2s ease" }}
                        />
                      </button>
                      <button
                        onClick={handleShare}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "#666",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          padding: 0,
                        }}
                        title="Share"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.2)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)"
                        }}
                      >
                        <Share2 size={20} style={{ transition: "transform 0.2s ease" }} />
                      </button>
                    </div>
                  </div>
                  <p
                    style={{
                      color: "#e0e0e0",
                      lineHeight: "1.6",
                      margin: 0,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    }}
                  >
                    {result.dobbyTake}
                  </p>
                </div>

                {/* Live Market Data Card */}
                <div
                  style={{
                    background: "#1e1e1e",
                    border: "1px solid #333",
                    borderRadius: "0.5rem",
                    padding: isMobile ? "0.875rem" : isTablet ? "1.25rem" : "1.5rem",
                    animation: "slideUp 0.5s ease-out",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#E63995"
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(230, 57, 149, 0.2)"
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#333"
                    e.currentTarget.style.boxShadow = "none"
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  <h2
                    style={{
                      fontSize: isMobile ? "1.1rem" : "1.25rem",
                      fontWeight: 700,
                      color: "#E63995",
                      margin: "0 0 1rem 0",
                    }}
                  >
                    Live Market Data
                  </h2>

                  {result.marketData.error ? (
                    <p style={{ color: "#aaa", margin: 0 }}>No live market data found.</p>
                  ) : result.marketData.categories ? (
                    <div style={{ color: "#e0e0e0" }}>
                      <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600 }}>Categories:</p>
                      <ul style={{ margin: 0, paddingLeft: "1.5rem", fontSize: isMobile ? "0.9rem" : "1rem" }}>
                        {result.marketData.categories.map((cat, idx) => (
                          <li key={idx} style={{ color: "#e0e0e0" }}>
                            {cat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : result.marketData.price !== undefined ? (
                    <div style={{ color: "#e0e0e0", lineHeight: "1.8", fontSize: isMobile ? "0.9rem" : "1rem" }}>
                      <p style={{ margin: "0 0 0.5rem 0" }}>
                        <strong>{result.marketData.name}</strong> ({result.marketData.symbol?.toUpperCase()})
                      </p>
                      <p style={{ margin: "0 0 0.5rem 0", fontSize: isMobile ? "1.25rem" : "1.5rem" }}>
                        {formatPrice(result.marketData.price)}
                      </p>
                      <p
                        style={{
                          margin: "0 0 0.5rem 0",
                          color: result.marketData.change_24h_percent! >= 0 ? "#4CAF50" : "#F44336",
                          fontWeight: 600,
                          animation: "glow 2s ease-in-out infinite",
                        }}
                      >
                        24h Change: {result.marketData.change_24h_percent?.toFixed(2)}%
                      </p>
                      {result.marketData.market_cap && (
                        <p style={{ margin: 0, fontSize: isMobile ? "0.8rem" : "0.9rem", color: "#aaa" }}>
                          Market Cap: {result.marketData.market_cap}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p style={{ color: "#aaa", margin: 0 }}>No market data available.</p>
                  )}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!result && !isLoading && !error && (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem 2rem",
                  color: "#666",
                  animation: "fadeIn 0.5s ease-out",
                }}
              >
                <p style={{ fontSize: "1rem" }}>Search for a crypto term to get started</p>
              </div>
            )}
          </div>

          {/* Sidebar - Hidden on Mobile */}
          {isDesktop && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                animation: "slideUp 0.5s ease-out 0.3s backwards",
              }}
            >
              {/* Favorites */}
              <div
                style={{
                  background: "#1e1e1e",
                  border: "1px solid #333",
                  borderRadius: "0.5rem",
                  padding: "1.5rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#E63995"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#333"
                }}
              >
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#E63995",
                    margin: "0 0 1rem 0",
                  }}
                >
                  Favorites
                </h3>
                {favorites.length === 0 ? (
                  <p style={{ color: "#666", fontSize: "0.9rem", margin: 0 }}>No favorites yet</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {favorites.map((fav, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnalyze(undefined, fav)}
                        style={{
                          background: "transparent",
                          border: "1px solid #333",
                          color: "#e0e0e0",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          transition: "all 0.2s ease",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#E63995"
                          e.currentTarget.style.color = "#E63995"
                          e.currentTarget.style.transform = "translateX(4px)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#333"
                          e.currentTarget.style.color = "#e0e0e0"
                          e.currentTarget.style.transform = "translateX(0)"
                        }}
                      >
                        {fav}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Trending Terms */}
              <div
                style={{
                  background: "#1e1e1e",
                  border: "1px solid #333",
                  borderRadius: "0.5rem",
                  padding: "1.5rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#E63995"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#333"
                }}
              >
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#E63995",
                    margin: "0 0 1rem 0",
                  }}
                >
                  Trending
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {TRENDING_TERMS.slice(0, 8).map((term, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnalyze(undefined, term)}
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        background: "transparent",
                        border: "1px solid #333",
                        color: "#e0e0e0",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        transition: "all 0.2s ease",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#E63995"
                        e.currentTarget.style.color = "#E63995"
                        e.currentTarget.style.transform = "translateX(4px)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#333"
                        e.currentTarget.style.color = "#e0e0e0"
                        e.currentTarget.style.transform = "translateX(0)"
                      }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div
                style={{
                  background: "rgba(230, 57, 149, 0.1)",
                  border: "1px solid #E63995",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  animation: "glow 2s ease-in-out infinite",
                }}
              >
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#aaa",
                    margin: 0,
                    lineHeight: "1.5",
                  }}
                >
                  <strong style={{ color: "#E63995" }}>Tip:</strong> Click the heart icon to save terms, or hit "Random
                  Term" to discover crypto concepts.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: isMobile ? "1rem" : isTablet ? "1.5rem 1rem" : "2rem 1.5rem",
          color: "#555",
          fontSize: isMobile ? "0.7rem" : isTablet ? "0.75rem" : "0.85rem",
          borderTop: "1px solid #333",
          marginTop: "auto",
          animation: "fadeIn 0.6s ease-out 0.4s backwards",
        }}
      >
        Powered by Sentient Dobby & CoinGecko. Built by josh
      </footer>
    </div>
  )
}
