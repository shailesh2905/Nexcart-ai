import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-text">
            <h1 className="gradient-text">Smarter Shopping.</h1>
            <h1>Better Decisions.</h1>
            <p className="hero-subtitle">
              Discover premium products curated by our advanced AI recommendation engine. 
              Elevate your lifestyle with NexCart.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary">Shop Now</button>
              <button className="btn btn-outline">Explore Categories</button>
            </div>
          </div>
          <div className="hero-image glass">
            {/* Placeholder for dynamic 3D graphic or beautiful lifestyle image */}
            <div className="placeholder-sphere"></div>
            <div className="glass-card float-1">🔥 Top Rated</div>
            <div className="glass-card float-2">✨ AI Curated</div>
          </div>
        </div>
      </section>

      {/* Recommended Products (Mock) */}
      <section className="container section-padding">
        <h2 className="section-title">Recommended For You</h2>
        <div className="products-grid">
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                products.slice(0, 8).map(product => (
                    <ProductCard key={product.id} product={product} />
                ))
            )}
        </div>
      </section>
    </div>
  );
};

export default Home;
