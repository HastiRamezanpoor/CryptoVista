async function fetchCryptoData() {
    const container = document.getElementById('crypto-container');
    const chartData = {
        labels: [],
        prices: [],
    };

    container.innerHTML = '<div class="loader">Loading data...</div>';

    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=true');
        const data = await response.json();

        container.innerHTML = ''; // Clear loader
        data.forEach(coin => {
            const cryptoItem = document.createElement('div');
            cryptoItem.classList.add('crypto-item');
            cryptoItem.innerHTML = `
                <h2><i class="fas fa-coins"></i> ${coin.name} (${coin.symbol.toUpperCase()})</h2>
                <p>Price: $${coin.current_price.toFixed(2)}</p>
                <p>24h Change: <span style="color: ${coin.price_change_percentage_24h >= 0 ? 'lime' : 'red'};">
                    ${coin.price_change_percentage_24h.toFixed(2)}%</span>
                </p>
            `;
            container.appendChild(cryptoItem);

            chartData.labels.push(coin.name);
            chartData.prices.push(coin.current_price);
        });

        renderChart(chartData);
    } catch (error) {
        container.innerHTML = '<div class="loader">Failed to load data. Please try again later.</div>';
        console.error('Error fetching crypto data:', error);
    }
}

async function fetchNews() {
    const container = document.getElementById('news-container');
    container.innerHTML = '<div class="loader">Loading news...</div>';

    try {
        const response = await fetch('https://newsapi.org/v2/everything?q=cryptocurrency&apiKey=6d40958f7580469392801a4b119341b9');
        const data = await response.json();

        container.innerHTML = '';
        data.articles.slice(0, 5).forEach(article => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');
            newsItem.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.description || 'No description available'}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            `;
            container.appendChild(newsItem);
        });
    } catch (error) {
        container.innerHTML = '<div class="loader">Failed to load news. Please try again later.</div>';
        console.error('Error fetching news:', error);
    }
}

// Render Chart
function renderChart(data) {
    const ctx = document.getElementById('cryptoChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Price in USD',
                data: data.prices,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                borderWidth: 2,
            }],
        },
    });
}

// Theme toggle
document.getElementById('toggle-theme').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
});

fetchCryptoData();
fetchNews();
