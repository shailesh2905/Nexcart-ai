import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Star, ArrowLeft } from 'lucide-react';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [qty, setQty] = useState(1);
    
    // Recommendations state
    const [recommendations, setRecommendations] = useState([]);
    const [recLoading, setRecLoading] = useState(false);
    
    const { addToCart } = React.useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (err) {
                setError(err.response && err.response.data.message ? err.response.data.message : err.message);
                setLoading(false);
            }
        };
        
        const fetchRecommendations = async () => {
            setRecLoading(true);
            try {
                // 1. Get recommended IDs from Python ML-Service
                const { data } = await axios.get(`http://localhost:5001/api/recommendations/${id}`);
                const recIds = data.recommended_product_ids;
                
                // 2. Fetch product details for each ID from Node.js backend
                if (recIds && recIds.length > 0) {
                    const promises = recIds.map(recId => axios.get(`/api/products/${recId}`));
                    const responses = await Promise.all(promises);
                    setRecommendations(responses.map(res => res.data));
                }
            } catch (err) {
                console.error("Failed to fetch recommendations:", err);
            } finally {
                setRecLoading(false);
            }
        };

        fetchProduct();
        fetchRecommendations();
    }, [id]);

    const addToCartHandler = () => {
        addToCart(product, qty);
        navigate('/cart');
    };

    return (
        <div className="container section-padding animate-fade-in">
            <Link to="/products" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                <ArrowLeft size={16} /> Go Back
            </Link>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                    
                    {/* Image Gallery */}
                    <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img 
                            src={product.image_url || `https://via.placeholder.com/600x600?text=${encodeURIComponent(product.name)}`} 
                            alt={product.name} 
                            style={{ width: '100%', maxWidth: '400px', objectFit: 'contain' }}
                        />
                    </div>

                    {/* Product Info */}
                    <div>
                        <span style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: '600' }}>
                            {product.category_name} | {product.brand}
                        </span>
                        <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: '#1e293b' }}>{product.name}</h1>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', marginBottom: '1.5rem' }}>
                            <Star size={18} className="filled" />
                            <span style={{ fontWeight: '600' }}>{product.rating}</span>
                            <span style={{ color: '#94a3b8' }}>({product.num_reviews} reviews)</span>
                        </div>

                        <h2 style={{ fontSize: '2rem', color: '#4f46e5', marginBottom: '1.5rem' }}>
                            ${product.price}
                        </h2>

                        <p style={{ color: '#4a4a68', lineHeight: '1.6', marginBottom: '2rem' }}>
                            {product.description}
                        </p>

                        <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <span>Status:</span>
                                <span style={{ fontWeight: '600', color: product.stock > 0 ? '#15803d' : '#b91c1c' }}>
                                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            {product.stock > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <span>Quantity:</span>
                                    <select 
                                        value={qty} 
                                        onChange={(e) => setQty(Number(e.target.value))}
                                        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                    >
                                        {[...Array(Math.min(product.stock, 10)).keys()].map(x => (
                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <button 
                                className="btn btn-primary btn-block" 
                                disabled={product.stock === 0}
                                onClick={addToCartHandler}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <ShoppingCart size={20} />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Recommendations Section */}
            {!loading && !error && (
                <div style={{ marginTop: '5rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#1e293b', borderBottom: '2px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                        Similar Products You Might Like
                    </h2>
                    
                    {recLoading ? (
                        <Loader />
                    ) : recommendations.length > 0 ? (
                        <div className="products-grid">
                            {recommendations.map(rec => (
                                <ProductCard key={rec.id} product={rec} />
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#64748b' }}>No recommendations available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
