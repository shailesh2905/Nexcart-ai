import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import './Header.css'; // Will create if needed, or inline glass classes

const Header = () => {
  return (
    <header className="glass header-nav">
      <div className="container header-container">
        <Link to="/" className="brand-logo">
          <h2>NexCart<span className="gradient-text">.AI</span></h2>
        </Link>

        <div className="search-bar glass">
          <input type="text" placeholder="Search products, brands..." />
          <button className="search-btn"><Search size={18} /></button>
        </div>

        <nav className="nav-links">
          <Link to="/products">Products</Link>
          <Link to="/categories">Categories</Link>
        </nav>

        <div className="nav-icons">
          <Link to="/cart" className="icon-link">
            <ShoppingCart size={24} />
            <span className="badge">0</span>
          </Link>
          <Link to="/login" className="icon-link">
            <User size={24} />
          </Link>
          <button className="mobile-menu-btn">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
