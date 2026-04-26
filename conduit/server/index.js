import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { paymentMiddleware, STXtoMicroSTX } from 'x402-stacks';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3402;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Free Endpoints
app.get('/api/v1/discover', (req, res) => {
  res.json({
    apis: [
      { id: 'weather', name: 'Weather API', price: '0.01 STX', method: 'GET', endpoint: '/api/v1/weather' },
      { id: 'sentiment', name: 'Sentiment Analysis', price: '0.02 STX', method: 'POST', endpoint: '/api/v1/sentiment' },
      { id: 'price', name: 'Crypto Prices', price: '0.005 STX', method: 'GET', endpoint: '/api/v1/price' },
      { id: 'chain-analytics', name: 'Chain Analytics', price: '0.02 STX', method: 'GET', endpoint: '/api/v1/chain-analytics' }
    ]
  });
});

app.get('/api/v1/stats', (req, res) => {
  res.json({
    totalTransactions: 1250,
    activeAgents: 45,
    volumeSTX: 250.5,
    status: 'healthy'
  });
});

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'up', timestamp: new Date().toISOString() });
});

// Paid Endpoints (x402-protected)
const x402Config = {
  payTo: process.env.STX_ADDRESS || 'SP1234567890ABCDEF1234567890ABCDEF12345678',
  network: process.env.NETWORK || 'mainnet',
  facilitatorUrl: process.env.FACILITATOR_URL || 'https://x402-facilitator.x402stacks.xyz'
};

app.get('/api/v1/weather', 
  paymentMiddleware({ ...x402Config, amount: STXtoMicroSTX(0.01), description: 'Weather Data' }),
  (req, res) => {
    res.json({ location: req.query.location || 'Global', temperature: '22°C', condition: 'Sunny' });
  }
);

app.post('/api/v1/sentiment',
  paymentMiddleware({ ...x402Config, amount: STXtoMicroSTX(0.02), description: 'Sentiment Analysis' }),
  (req, res) => {
    res.json({ sentiment: 'positive', score: 0.95 });
  }
);

app.get('/api/v1/price',
  paymentMiddleware({ ...x402Config, amount: STXtoMicroSTX(0.005), description: 'Crypto Price Oracle' }),
  (req, res) => {
    const symbol = req.query.symbol || 'BTC';
    res.json({ symbol, price: 97500.00, currency: 'USD' });
  }
);

app.get('/api/v1/chain-analytics',
  paymentMiddleware({ ...x402Config, amount: STXtoMicroSTX(0.02), description: 'Stacks Chain Analytics' }),
  (req, res) => {
    res.json({ blockHeight: 123456, tps: 15.5, activeWallets: 5000 });
  }
);

app.listen(PORT, () => {
  console.log(`⚡ Conduit Server running at http://localhost:${PORT}`);
});
