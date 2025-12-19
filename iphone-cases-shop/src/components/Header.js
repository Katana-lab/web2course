import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Header.css';

const Header = ({ onCartClick }) => {
  // Отримуємо кількість товарів з Redux store
  const totalQuantity = useSelector(state => state.cart.totalQuantity);
  
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>iPhoneCases</h1>
        </Link>
        <div className="header-info">
          <div className="contact-info">
            <span>📞 (044) 123-45-67</span>
            <span>🕒 9:00 - 21:00</span>
          </div>
          <div className="user-actions">
            <button className="icon-btn">🔍</button>
            <button className="icon-btn">❤️</button>
            <button 
              className="icon-btn cart-btn"
              onClick={onCartClick}
            >
              🛒
              {/* Відображаємо бейдж, якщо є товари */}
              {totalQuantity > 0 && (
                <span className="cart-badge">{totalQuantity}</span>
              )}
            </button>
            <Link to="/cart" className="icon-btn cart-page-link">
              📋
            </Link>
            <button className="icon-btn">👤</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;