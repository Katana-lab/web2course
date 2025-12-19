import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card-link">
      <div className="product-card">
        {product.isNew && <span className="new-badge">NEW</span>}
        {!product.inStock && <span className="out-of-stock-badge">Немає в наявності</span>}
        
        <div className="product-rating">
          {'⭐'.repeat(Math.floor(product.rating))}
          <span className="rating-value">{product.rating}</span>
        </div>
        
        <div className="product-image">
          <img 
            src={product.image} 
            alt={product.name}
            className="product-image-img"
          />
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          
          <div className="product-colors">
            {product.colors.map((color, index) => (
              <span 
                key={index} 
                className="color-dot" 
                style={{backgroundColor: getColorCode(color)}}
                title={color}
              ></span>
            ))}
          </div>
          
          <div className="product-price">{product.price} ₴</div>
          
          <button 
            className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            {product.inStock ? 'Додати в кошик' : 'Немає в наявності'}
          </button>
        </div>
      </div>
    </Link>
  );
};

const getColorCode = (color) => {
  const colorMap = {
    'червоний': '#ff4444',
    'чорний': '#000000',
    'блакитний': '#4488ff',
    'прозорий': '#f0f0f0',
    'матовий': '#e0e0e0',
    'коричневий': '#8B4513',
    'синій': '#0000ff',
    'рожевий': '#ff69b4',
    'зелений': '#00aa00',
    'білий': '#ffffff'
  };
  return colorMap[color] || '#cccccc';
};

export default ProductCard;