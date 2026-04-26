# ⚡ Conduit

Pay-per-call API marketplace powered by x402 payments on the Stacks blockchain.

AI agents autonomously discover, pay for, and consume APIs using HTTP 402 — no API keys, no subscriptions, just HTTP and STX.

Built with x402-stacks Network License

**Talent Protocol Update (April 2026):** New features added for the hackathon event including on-chain analytics helpers, trust scoring enhancements, and a streamlined event submission flow. See `EVENT_SUBMISSION.md` for details.

## The Problem
Today's API economy is broken for machines:
- Agents need API keys that require human account creation
- Rate limits and subscriptions assume human consumption patterns
- No protocol-level standard for machine-to-machine payments

## The Solution
Conduit uses the x402 payment protocol to create a marketplace where:
- 🤖 **AI Agents** discover available APIs via a free catalog endpoint
- 🔒 **Paid endpoints** return HTTP 402 Payment Required with pricing
- 💎 **The x402-stacks interceptor** auto-pays in STX and retries
- ⚡ **Data flows back** — no accounts, no keys, no friction

**Flow:**
1. Agent → `GET /api/v1/price?symbol=BTC`
2. Server → `402 Payment Required (0.005 STX)`
3. Agent → Signs STX transfer via x402 interceptor
4. Server → `200 OK + { price: 97500.00, ... }`

## Architecture
┌─────────────────────────────────────────────────────────────┐
│                      Conduit Server                         │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Free Layer   │  │ x402 Paywall │  │ API Services     │  │
│  │              │  │              │  │                  │  │
│  │ /discover    │  │ paymentMiddle│  │ Weather          │  │
│  │ /stats       │  │ ware()       │  │ Sentiment        │  │
│  │ /health      │  │              │  │ Translation      │  │
│  └──────────────┘  │ Validates    │  │ Crypto Prices    │  │
│                    │ payment-sig  │  │ Image Gen        │  │
│                    │ header       │  │ Code Review      │  │
│                    └──────┬───────┘  │ News             │  │
│                           │          │ Chain Analytics   │  │
│                    ┌──────▼───────┐  └──────────────────┘  │
│                    │ Facilitator  │                         │
│                    │ Settlement   │                         │
│                    └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘

## Quick Start

### Prerequisites
- Node.js >= 18

### Installation
```bash
# Clone
git clone https://github.com/Earnwithalee7890/x402-devkit.git
cd 402-devkit

# Install
npm install

# Configure (optional — defaults work out of the box)
cp .env.example .env

# Run
npm run build
npm run dev
```
Open http://localhost:3402 in your browser.

## API Reference

### Free Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/discover` | GET | Full API catalog with pricing and docs |
| `/api/v1/stats` | GET | Marketplace analytics and recent transactions |
| `/api/v1/health` | GET | Server health check |

### Paid Endpoints (x402-protected)
| Endpoint | Method | Price | Description |
|----------|--------|-------|-------------|
| `/api/v1/weather` | GET | 0.01 STX | Weather data and forecasts |
| `/api/v1/sentiment` | POST | 0.02 STX | NLP sentiment analysis |
| `/api/v1/translate` | POST | 0.015 STX | Neural machine translation |
| `/api/v1/price` | GET | 0.005 STX | Crypto price oracle |
| `/api/v1/generate-image` | POST | 0.05 STX | AI image generation |
| `/api/v1/code-review` | POST | 0.03 STX | Automated code review |
| `/api/v1/news` | GET | 0.008 STX | AI-curated news feed |
| `/api/v1/chain-analytics` | GET | 0.02 STX | Stacks on-chain analytics |

## Agent Integration

### Client (Auto-pay with x402 interceptor)
```javascript
import axios from 'axios';
import { wrapAxiosWithPayment, privateKeyToAccount } from 'x402-stacks';

const account = privateKeyToAccount(process.env.PRIVATE_KEY, 'mainnet');

const api = wrapAxiosWithPayment(
  axios.create({ baseURL: 'http://localhost:3402' }),
  account
);

// Discover APIs (free)
const catalog = await api.get('/api/v1/discover');

// Use paid APIs — payment is automatic
const weather = await api.get('/api/v1/weather?location=Tokyo');
const price = await api.get('/api/v1/price?symbol=BTC');
```

### Server (Monetize your own API)
```javascript
import express from 'express';
import { paymentMiddleware, STXtoMicroSTX } from 'x402-stacks';

const app = express();

app.get('/api/premium',
  paymentMiddleware({
    amount: STXtoMicroSTX(0.01),
    payTo: 'YOUR_STACKS_ADDRESS',
    network: 'mainnet',
    facilitatorUrl: 'https://x402-facilitator.x402stacks.xyz',
    description: 'Premium data access',
  }),
  (req, res) => res.json({ data: 'Your premium content' })
);
```

## Smart Contracts (Clarity)
Conduit includes 4 production-ready Clarity smart contracts:
1. `api-registry.clar` — On-Chain API Registry
2. `payment-escrow.clar` — Payment Escrow & Settlement
3. `reputation.clar` — On-Chain Reputation System
4. `subscription-manager.clar` — Prepaid Credits & Subscriptions

## Project Structure
```
conduit/
├── contracts/
│   ├── api-registry.clar
│   ├── payment-escrow.clar
│   ├── reputation.clar
│   └── subscription-manager.clar
├── server/index.js
├── public/
│   ├── index.html
│   ├── css/styles.css
│   └── js/app.js
├── agent-demo/agent.js
├── package.json
├── .env.example
├── LICENSE
└── README.md
```

## License
MIT — see LICENSE
