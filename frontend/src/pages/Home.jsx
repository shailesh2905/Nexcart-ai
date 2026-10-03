import React from 'react';
import './Home.css';

const Home = () => {
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
            {[1, 2, 3, 4].map(item => (
                <div key={item} className="product-card glass">
                    <div className="product-img-placeholder"></div>
                    <div className="product-info">
                        <span className="product-category">Electronics</span>
                        <h3 className="product-name">NexCart Premium Device {item}</h3>
                        <div className="product-price-row">
                            <span className="product-price">$299.99</span>
                            <button className="add-to-cart-btn">+</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
