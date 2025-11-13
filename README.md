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