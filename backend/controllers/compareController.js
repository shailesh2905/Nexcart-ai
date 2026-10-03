const axios = require('axios');
const cheerio = require('cheerio');

// @desc    Mock Aggregator for Price Comparison
// @route   GET /api/compare?q=searchterm
// @access  Public
const getPriceComparisons = async (req, res) => {
    try {
        const query = req.query.q;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const results = [];

        try {
            // Real Web Scraping from eBay!
            const ebayUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`;
            const { data } = await axios.get(ebayUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
            });
            const $ = cheerio.load(data);
            
            // Find the first organic item in the list
            const firstItem = $('.s-item__wrapper').eq(1); // .eq(0) is sometimes a hidden shop element on eBay
            if (firstItem.length) {
                const priceText = firstItem.find('.s-item__price').text();
                // Clean price text (e.g., "$150.00 to $200.00" -> extract first match)
                const priceMatch = priceText.match(/[\d,]+\.\d{2}/);
                const price = priceMatch ? parseFloat(priceMatch[0].replace(/,/g, '')) : null;
                const itemUrl = firstItem.find('.s-item__link').attr('href');
                
                if (price && itemUrl) {
                    results.push({
                        retailer: 'eBay (Live Scrape)',
                        price: price.toFixed(2),
                        url: itemUrl.split('?')[0], // Clean URL tracking
                        inStock: true,
                        logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg',
                        shipping: 'Live Data'
                    });
                }
            }
        } catch (scrapeErr) {
            console.error('eBay Scrape Error:', scrapeErr.message);
        }

        // Add some mock data based on the real price to keep the UI rich
        const basePrice = results.length > 0 ? parseFloat(results[0].price) : Math.floor(Math.random() * (500 - 50 + 1) + 50);

        results.push(
            {
                retailer: 'Amazon (Simulated)',
                price: (basePrice * 1.05).toFixed(2), 
                url: `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
                inStock: true,
                logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
                shipping: 'Free with Prime'
            },
            {
                retailer: 'Walmart (Simulated)',
                price: (basePrice * 0.98).toFixed(2), 
                url: `https://www.walmart.com/search?q=${encodeURIComponent(query)}`,
                inStock: true,
                logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg',
                shipping: 'Free Shipping'
            }
        );

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
