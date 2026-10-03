// @desc    Mock Aggregator for Price Comparison
// @route   GET /api/compare?q=searchterm
// @access  Public
const getPriceComparisons = async (req, res) => {
    try {
        const query = req.query.q;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Simulate network delay for fetching from external sites
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock algorithm to generate realistic-looking prices based on the string length
        // In a real app, this would use Puppeteer/Cheerio to scrape, or call official affiliate APIs
        const basePrice = Math.floor(Math.random() * (500 - 50 + 1) + 50) + (query.length * 5);

        const results = [
            {
                retailer: 'Amazon',
                price: (basePrice * 0.95).toFixed(2), // usually cheapest
                url: `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
                inStock: true,
                logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
                shipping: 'Free with Prime'
            },
            {
                retailer: 'eBay',
                price: (basePrice * 0.85).toFixed(2), // cheaper but maybe used
                url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`,
                inStock: true,
                logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg',
                shipping: '+$5.99 Shipping'
            },
            {
                retailer: 'Walmart',
                price: (basePrice * 1.05).toFixed(2), // standard retail
                url: `https://www.walmart.com/search?q=${encodeURIComponent(query)}`,
                inStock: true,
                logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg',
                shipping: 'Free Shipping'
            },
            {
                retailer: 'Best Buy',
                price: (basePrice * 1.10).toFixed(2), // slightly more expensive
                url: `https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(query)}`,
                inStock: Math.random() > 0.3, // 70% chance of being in stock
                logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_Logo.svg',
                shipping: 'In-store pickup only'
            }
        ];

        // Sort by price ascending
        results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

        res.json({
            product: query,
            results: results
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to aggregate prices' });
    }
};

module.exports = { getPriceComparisons };
