import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartTotalItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
            {cartTotalItems > 0 && <span className="badge">{cartTotalItems}</span>}
          </Link>
          
          {user ? (
            <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {user.role === 'admin' && (
                <Link to="/admin" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4f46e5', textDecoration: 'none' }}>
                  Admin
                </Link>
              )}
              <span className="user-name">Hi, {user.first_name}</span>
              <button onClick={handleLogout} className="logout-btn" title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="icon-link" title="Sign In">
              <User size={24} />
            </Link>
          )}

          <button className="mobile-menu-btn">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
