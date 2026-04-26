document.addEventListener('DOMContentLoaded', async () => {
    const apiList = document.getElementById('api-list');
    const statTx = document.getElementById('stat-tx');
    const statAgents = document.getElementById('stat-agents');
    const statVolume = document.getElementById('stat-volume');

    // Fetch Stats
    try {
        const statsRes = await fetch('/api/v1/stats');
        const stats = await statsRes.json();
        
        animateValue(statTx, 0, stats.totalTransactions, 2000);
        animateValue(statAgents, 0, stats.activeAgents, 1500);
        animateValue(statVolume, 0, stats.volumeSTX, 1800, true);
    } catch (err) {
        console.error('Failed to load stats:', err);
    }

    // Fetch APIs
    try {
        const discoverRes = await fetch('/api/v1/discover');
        const data = await discoverRes.json();
        
        apiList.innerHTML = '';
        data.apis.forEach(api => {
            const card = document.createElement('div');
            card.className = 'api-card';
            card.innerHTML = `
                <div class="api-name">${api.name}</div>
                <span class="api-price">${api.price}</span>
                <div class="api-meta">
                    <span class="api-method">${api.method}</span>
                    <span class="api-endpoint" style="color: var(--text-dim); font-family: monospace; font-size: 0.9rem;">${api.endpoint}</span>
                </div>
                <button class="btn-secondary" style="margin-top: 2rem; width: 100%;" onclick="alert('Connect an AI agent to consume this API via x402.')">Test Endpoint</button>
            `;
            apiList.appendChild(card);
        });
    } catch (err) {
        apiList.innerHTML = '<div class="loading">Error loading marketplace data. Please try again later.</div>';
        console.error('Failed to load APIs:', err);
    }
});

function animateValue(obj, start, end, duration, isFloat = false) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = progress * (end - start) + start;
        obj.innerHTML = isFloat ? current.toFixed(2) : Math.floor(current);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
