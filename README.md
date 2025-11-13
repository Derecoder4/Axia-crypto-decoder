# Axia - Crypto Term Decoder 🧠⚡

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Fireworks AI](https://img.shields.io/badge/Powered%20by-Fireworks%20AI-orange)

> **"Listen, DeFi is basically just banks but run by computer nerds instead of old guys in suits." — Dobby**

**Axia** is a modern crypto education platform that cuts through the jargon. Instead of boring textbook definitions, it uses **Dobby AI** (a blunt, unhinged Llama-3 model) to explain complex crypto concepts in plain English. It combines these witty insights with real-time market data to give users the full picture.

---

## ✨ Features

### Core Functionality
* **AI-Powered Analysis:** Get blunt, witty explanations from Dobby AI (powered by the `dobby-mini-unhinged-plus` model).
* **Live Market Data:** Automatically fetches real-time Price, 24h Change, and Market Cap from CoinGecko for any token.
* **Concept-Aware:** Intelligently detects if a search term is a **concept** (like "DeFi") or a **token** (like "Bitcoin") and adjusts the data display.

### UI & UX
* **Modern Stack:** Built with Next.js 16 (App Router) and React 19.
* **Dynamic UI:** Sleek dark mode with custom animations (`slideUp`, `glow`, `fadeIn`).
* **Discovery:** A "Trending" terms sidebar and a "Random Term" button to help users discover new concepts.

### User Persistence
* **Favorites:** Save, view, and re-analyze your favorite terms.
* **Search History:** Quickly access your last 5 searches from a dropdown.
* **Persistent State:** Uses `localStorage` to remember your favorites and history between sessions.

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
| --- | --- | --- |
| **Frontend** | **Next.js 16** (App Router) | UI & Serverless API Routes |
| **Styling** | **Tailwind CSS** | Utility-first styling & animations |
| **State** | **React Hooks** (`useState`, `useEffect`) | Managing all local UI state |
| **Persistence**| `localStorage` | Storing user favorites & history |
| **Backend AI** | **Fireworks AI** | Serving the **Dobby Unhinged Plus** model |
| **Backend Data** | **CoinGecko API** | Providing live market data |

---

## 🚀 Getting Started

Follow these steps to get Axia running on your local machine.

### Prerequisites
* Node.js (v18 or higher)
* `pnpm` (This project uses `pnpm` for package management)

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/axia-crypto-decoder.git](https://github.com/your-username/axia-crypto-decoder.git)
cd axia-crypto-decoder

"### 2. Install Dependencies"
 
''pnpm install

"### Configure Environment Variables
Create a file named .env.local in the root of the project. You will need a Fireworks AI API key.

# Get your key from [https://fireworks.ai](https://fireworks.ai)
FIREWORKS_API_KEY=YOUR_FIREWORKS_KEY_GOES_HERE

"###  Run the Development Server
pnpm run dev
Open http://localhost:3000 in your browser to see the app.

"###  🔌 API Endpoints
The app's backend logic is contained in two Next.js API Routes:

POST /api/analyze This is the main engine. It receives a term, sends it to Fireworks AI for analysis, and simultaneously fetches market data from CoinGecko.

GET /api/random-term Provides a random term from a predefined list, which is then used to call the /api/analyze endpoint.

###  📂 Project Structure
axia-crypto-decoder/
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts  <-- The main AI + CoinGecko logic
│   │   └── random-term/
│   │       └── route.ts  <-- The random term logic
│   ├── globals.css       <-- All custom styles & animations
│   ├── layout.tsx        <-- The main app shell
│   └── page.tsx          <-- The main page UI
├── components/
│   ├── navbar.tsx
│   └── particle-background.tsx
├── .env.local            <-- Your API key (secret!)
├── package.json
└── README.md


🤝 Contributing
Contributions are welcome! If you want to make Dobby smarter (or meaner), feel free to open a PR.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
Distributed under the MIT License.
