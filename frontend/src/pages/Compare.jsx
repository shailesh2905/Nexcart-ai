import React, { useState } from 'react';
import axios from 'axios';
import { Search, ExternalLink, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import Loader from '../components/Loader';
import Message from '../components/Message';
import './Compare.css';

const Compare = () => {
    const [query, setQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState([]);
    const [productName, setProductName] = useState('');

    const searchHandler = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setHasSearched(true);
        
        try {
            const { data } = await axios.get(`/api/compare?q=${query}`);
            setResults(data.results);
            setProductName(data.product);
            setLoading(false);
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
            setLoading(false);
        }
    };

    return (
        <div className="container section-padding animate-fade-in compare-page">
            <div className="compare-header">
                <h1 className="section-title" style={{ marginBottom: '1rem' }}>Price Comparison Engine</h1>
                <p>Instantly scan top retailers to find the cheapest price across the web.</p>
                
                <form onSubmit={searchHandler} className="compare-search-bar glass">
                    <input 
                        type="text" 
                        placeholder="e.g. Apple iPhone 15 Pro, Sony WH-1000XM5..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" className="search-btn">
                        <Search size={20} /> Compare
                    </button>
                </form>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <Loader />
                    <p style={{ marginTop: '1rem', color: '#64748b' }}>Aggregating prices from Amazon, eBay, Walmart, and Best Buy...</p>
                </div>
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : hasSearched && results.length > 0 ? (
                <div className="compare-results">
                    <h2 className="results-title">
                        Found {results.length} prices for <span className="highlight">"{productName}"</span>
                    </h2>
                    
                    <div className="results-grid">
                        {results.map((item, index) => (
                            <div key={index} className={`result-card glass ${index === 0 ? 'cheapest' : ''}`}>
                                {index === 0 && <div className="cheapest-badge">🔥 Lowest Price</div>}
                                
                                <div className="retailer-logo">
                                    <img src={item.logo} alt={item.retailer} />
                                </div>
                                
                                <div className="price-tag">
                                    ${item.price}
                                </div>
                                
                                <div className="stock-status">
                                    {item.inStock ? (
                                        <span className="in-stock"><CheckCircle size={14} /> In Stock</span>
                                    ) : (
                                        <span className="out-of-stock"><XCircle size={14} /> Out of Stock</span>
                                    )}
                                </div>
                                
                                <div className="shipping-info">
                                    {item.shipping}
                                </div>
                                
                                <a 
                                    href={item.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className={`btn btn-block ${index === 0 ? 'btn-primary' : 'btn-outline'}`}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: 'auto' }}
                                >
                                    <ShoppingCart size={16} /> View Deal <ExternalLink size={14} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            ) : hasSearched && results.length === 0 && (
                <Message>No prices found for "{productName}". Try a different search term.</Message>
            )}
        </div>
    );
};

export default Compare;
