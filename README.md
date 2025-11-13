# Axia - Crypto Term Decoder 🧠⚡

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![AI](https://img.shields.io/badge/Powered%20by-Dobby%20AI-pink)

> **"Listen, DeFi is basically just banks but run by computer nerds instead of old guys in suits." — Dobby**

**Axia** is a modern crypto education platform that cuts through the jargon. Instead of boring textbook definitions, it uses **Dobby AI** (a blunt, unhinged Llama-3 model) to explain complex crypto concepts in plain English. It combines these witty insights with real-time market data to give users the full picture.

---

## ✨ Features

### 🔍 Core Functionality
- **AI-Powered Analysis:** Enter any term (e.g., "Impermanent Loss", "ZK-Rollup") and get a blunt, easy-to-understand explanation from Dobby.
- **Live Market Data:** Automatically fetches real-time Price, Market Cap, and 24h Change data via CoinGecko for relevant tokens.
- **Trending & Random:** Discover new concepts via the "Trending" sidebar or the "Random Term" generator.

### 🎨 UX & UI
- **Modern Stack:** Built with Next.js 16 (App Router) and React 19.
- **Sleek Design:** Fully responsive Dark Mode UI using Tailwind CSS v4.
- **Interactive:** Smooth animations using Framer Motion and custom CSS keyframes.
- **User Persistence:** Saves your **Search History** and **Favorites** locally so you never lose track of your learning.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS, Lucide React (Icons), Framer Motion
- **Backend / API:** Next.js Serverless API Routes (`/app/api`)
- **AI Model:** SentientAGI/Dobby-Mini-Unhinged-Llama-3.1-8B (via Hugging Face Inference API)
- **Market Data:** CoinGecko Public API

---

## 🚀 Getting Started

Follow these steps to get Axia running on your local machine.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/axia-crypto.git](https://github.com/yourusername/axia-crypto.git)
cd axia-crypto
2. Install Dependencies
Bash

npm install
# or
yarn install
3. Configure Environment Variables
Create a .env.local file in the root directory. You will need a Hugging Face Access Token (free).

Bash

# .env.local

# Get your token here: [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
HUGGING_FACE_API_KEY=hf_your_token_goes_here
4. Run the Development Server
Bash

npm run dev
Open http://localhost:3000 with your browser to see the result.

🔌 API Reference
Axia uses an internal Next.js API route to bridge the client with the AI and Data providers.

POST /api/analyze
Analyzes a crypto term and fetches market data.

Request Body:

JSON

{
  "term": "Ethereum"
}
Response:

JSON

{
  "dobbyTake": "Ethereum is basically the world's slowest, most expensive computer...",
  "marketData": {
    "price": 2500.50,
    "change_24h": 1.25,
    "market_cap": 300000000000,
    "symbol": "ETH"
  }
}
📂 Project Structure
axia-crypto/
├── public/              # Static assets
├── src/
│   ├── app/
│   │   ├── api/         # Server-side API logic
│   │   │   └── analyze/ # The AI & CoinGecko handler
│   │   ├── globals.css  # Global styles & Tailwind imports
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Main UI (Search, Results, Sidebar)
│   └── lib/             # Utility functions (optional)
├── .env.local           # API Keys (Do not commit this!)
├── next.config.mjs      # Next.js configuration
└── README.md            # You are here
🤝 Contributing
Contributions are welcome! If you want to make Dobby smarter (or meaner), feel free to open a PR.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
Distributed under the MIT License. See LICENSE for more information.

Built with ❤️ (and a bit of sarcasm) by josh