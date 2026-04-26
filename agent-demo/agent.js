import axios from 'axios';
import dotenv from 'dotenv';
// Note: x402-stacks would be imported here in a real environment
// import { wrapAxiosWithPayment, privateKeyToAccount } from 'x402-stacks';

dotenv.config();

/**
 * MOCK x402-stacks for demonstration purposes
 * In a real scenario, this would handle the HTTP 402 retry logic automatically.
 */
const mockX402Interceptor = {
    wrap: (instance) => {
        instance.interceptors.response.use(
            response => response,
            async error => {
                if (error.response && error.response.status === 402) {
                    console.log('💎 Caught HTTP 402 Payment Required');
                    const paymentDetails = error.response.data;
                    console.log(`💸 Amount: ${paymentDetails.amount} microSTX`);
                    console.log(`📍 Pay to: ${paymentDetails.payTo}`);
                    
                    console.log('⚡ Signing STX transfer...');
                    // Simulate payment delay
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    console.log('✅ Payment signed. Retrying request with x402-payment-sig...');
                    
                    // In real x402-stacks, this retry is automatic and includes the signature header
                    const retryConfig = error.config;
                    retryConfig.headers['x402-payment-sig'] = 'mock-signature-' + Date.now();
                    return instance.request(retryConfig);
                }
                return Promise.reject(error);
            }
        );
        return instance;
    }
};

async function runDemo() {
    console.log('🤖 Starting AI Agent Demo (Conduit + x402)');
    
    const api = mockX402Interceptor.wrap(
        axios.create({ baseURL: 'http://localhost:3402' })
    );

    try {
        console.log('\n--- Step 1: Discover available APIs (Free) ---');
        const catalog = await api.get('/api/v1/discover');
        console.log(`Found ${catalog.data.apis.length} APIs in the marketplace.`);

        console.log('\n--- Step 2: Accessing paid endpoint: Weather ---');
        const weather = await api.get('/api/v1/weather?location=London');
        console.log('API Response:', weather.data);

        console.log('\n--- Step 3: Accessing paid endpoint: Crypto Price ---');
        const price = await api.get('/api/v1/price?symbol=BTC');
        console.log('API Response:', price.data);

        console.log('\n--- Step 4: Accessing paid endpoint: Sentiment (POST) ---');
        const sentiment = await api.post('/api/v1/sentiment', { text: "Conduit is amazing!" });
        console.log('API Response:', sentiment.data);

        console.log('\n--- Success: All APIs consumed autonomously ---');
    } catch (error) {
        console.error('Agent execution failed:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
        }
    }
}

runDemo();
