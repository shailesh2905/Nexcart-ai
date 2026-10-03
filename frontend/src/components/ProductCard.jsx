import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = React.useContext(CartContext);
  return (
    <div className="product-card glass">
      <Link to={`/product/${product.id}`} className="product-img-link">
        {/* We use a placeholder image if product doesn't have an image_url since we're using dummy data */}
        <div className="product-img-wrapper">
            <img 
              src={product.image_url || `https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name)}`} 
              alt={product.name} 
              className="product-img"
            />
            {product.discount > 0 && (
                <span className="discount-badge">-{product.discount}%</span>
            )}
        </div>
      </Link>
      <div className="product-info">
        <span className="product-category">{product.category_name || 'Category'}</span>
        <Link to={`/product/${product.id}`} className="product-name-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>
        
        <div className="product-rating">
            <Star size={14} className="star-icon filled" />
            <span>{product.rating}</span>
            <span className="review-count">({product.num_reviews})</span>
        </div>

        <div className="product-price-row">
          <div className="price-container">
              <span className="product-price">${product.price}</span>
          </div>
          <button 
            className="add-to-cart-btn" 
            title="Add to Cart"
            onClick={(e) => {
              e.preventDefault(); // Prevent navigating to product details if card is clicked
              addToCart(product, 1);
            }}
          >
             <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
