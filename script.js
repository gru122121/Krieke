// Function to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to extract Steam data from HTML string
function extractSteamData(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    let stats = {
        itemsOwned: '...',
        tradesMade: '...',
        marketTransactions: '...'
    };

    try {
        // Find the showcase stats row
        const statsRow = doc.querySelector('.showcase_stats_trading');
        if (statsRow) {
            const statValues = statsRow.querySelectorAll('.showcase_stat .value');
            if (statValues.length >= 3) {
                stats = {
                    itemsOwned: statValues[0].textContent.trim(),
                    tradesMade: statValues[1].textContent.trim(),
                    marketTransactions: statValues[2].textContent.trim()
                };
            }
        }
    } catch (error) {
        console.error('Error parsing Steam stats:', error);
    }

    return { stats };
}

// Function to update stats display
function updateDisplay(steamData) {
    if (steamData && steamData.stats) {
        document.getElementById('items-owned').textContent = 
            steamData.stats.itemsOwned !== '...' ? formatNumber(steamData.stats.itemsOwned) : '...';
        document.getElementById('trades-made').textContent = 
            steamData.stats.tradesMade !== '...' ? formatNumber(steamData.stats.tradesMade) : '...';
        document.getElementById('market-transactions').textContent = 
            steamData.stats.marketTransactions !== '...' ? formatNumber(steamData.stats.marketTransactions) : '...';
    }
}

// Function to fetch Steam profile data
async function fetchSteamData() {
    try {
        const corsProxy = 'https://corsproxy.io/?';
        const steamUrl = 'https://steamcommunity.com/id/CaseHardeneds/';
        
        const response = await fetch(corsProxy + encodeURIComponent(steamUrl));
        if (!response.ok) throw new Error('Failed to fetch Steam data');

        const html = await response.text();
        const data = extractSteamData(html);
        
        // Cache the data
        localStorage.setItem('steamData', JSON.stringify({
            data,
            timestamp: Date.now()
        }));

        return data;
    } catch (error) {
        console.error('Error fetching Steam data:', error);
        
        // Try to use cached data
        const cached = localStorage.getItem('steamData');
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < 3600000) { // 1 hour
                return data;
            }
        }
        
        return null;
    }
}

// Initialize loading state only for Steam stats
document.querySelectorAll('.steam-stats .stat-value').forEach(el => {
    el.textContent = '...';
});

// Function to update data
async function updateData() {
    const steamData = await fetchSteamData();
    updateDisplay(steamData);
}

// Try to show cached data immediately
const cachedSteam = localStorage.getItem('steamData');
if (cachedSteam) {
    const { data } = JSON.parse(cachedSteam);
    updateDisplay(data);
}

// Fetch fresh data
updateData();

// Update every 5 minutes
setInterval(updateData, 300000);
