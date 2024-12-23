// Function to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to update stats
function updateStats() {
    // Items owned (random between 2000-3000)
    const itemsOwned = document.getElementById('items-owned');
    if (itemsOwned) {
        const randomItems = Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000;
        itemsOwned.textContent = formatNumber(randomItems);
    }

    // Trades made (random between 20000-25000)
    const tradesMade = document.getElementById('trades-made');
    if (tradesMade) {
        const randomTrades = Math.floor(Math.random() * (25000 - 20000 + 1)) + 20000;
        tradesMade.textContent = formatNumber(randomTrades);
    }

    // Market transactions (random between 10000-15000)
    const marketTransactions = document.getElementById('market-transactions');
    if (marketTransactions) {
        const randomTransactions = Math.floor(Math.random() * (15000 - 10000 + 1)) + 10000;
        marketTransactions.textContent = formatNumber(randomTransactions);
    }
}

// Update stats on page load
document.addEventListener('DOMContentLoaded', updateStats);

// Update stats every 5 minutes
setInterval(updateStats, 300000);