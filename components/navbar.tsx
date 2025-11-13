"use client"

interface NavbarProps {
  onRandomTerm?: () => void
}

export function Navbar({ onRandomTerm }: NavbarProps) {
  return (
    <nav
      style={{
        background: "#1a1a1a",
        padding: "1rem 2rem",
        borderBottom: "1px solid #333",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo and Branding */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundImage:
                "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMxYTFhMWEiIHJ4PSI4Ii8+PC9zdmc+')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              borderRadius: "0.5rem",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "100%", height: "100%" }}
            >
              {/* Simplified Dobby mascot */}
              <circle cx="50" cy="35" r="20" fill="#F4D9A6" stroke="#000" strokeWidth="2" />
              <ellipse cx="40" cy="32" rx="6" ry="10" fill="#000" />
              <ellipse cx="60" cy="32" rx="6" ry="10" fill="#000" />
              <circle cx="42" cy="30" r="2.5" fill="#fff" />
              <circle cx="62" cy="30" r="2.5" fill="#fff" />
              <path d="M 50 40 Q 45 43 42 42" stroke="#000" strokeWidth="1.5" fill="none" />
              <path d="M 50 40 Q 55 43 58 42" stroke="#000" strokeWidth="1.5" fill="none" />
              <path d="M 48 44 L 50 48 L 52 44" fill="#8B0000" stroke="#000" strokeWidth="1" />
            </svg>
          </div>
          <div>
            <h1
              style={{
                color: "#E63995",
                fontWeight: 900,
                fontSize: "1.5rem",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              Axia
            </h1>
            <p style={{ color: "#aaa", fontSize: "0.75rem", margin: 0 }}>Powered by Dobby</p>
          </div>
        </div>

        {/* Nav Links */}
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <button
            onClick={onRandomTerm}
            style={{
              background: "transparent",
              border: "1px solid #E63995",
              color: "#E63995",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#E63995"
              e.currentTarget.style.color = "#fff"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.color = "#E63995"
            }}
          >
            Random Term
          </button>
        </div>
      </div>
    </nav>
  )
}
