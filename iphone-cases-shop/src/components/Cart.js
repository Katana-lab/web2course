import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  removeItemFromCart, 
  increaseQuantity, 
  decreaseQuantity, 
  clearCart 
} from '../redux/cartSlice';
import './Cart.css';

const Cart = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector(state => state.cart);
  
  if (!isOpen) return null;

  const handleRemoveItem = (cartItemId) => {
    dispatch(removeItemFromCart(cartItemId));
  };
  
  const handleIncreaseQuantity = (cartItemId) => {
    dispatch(increaseQuantity(cartItemId));
  };
  
  const handleDecreaseQuantity = (cartItemId) => {
    dispatch(decreaseQuantity(cartItemId));
  };
  
  const handleClearCart = () => {
    if (window.confirm('Ви впевнені, що хочете очистити кошик?')) {
      dispatch(clearCart());
    }
  };
  
  const handleCheckout = () => {
    alert('Оформлення замовлення...');
    onClose();
  };

  // Функція для отримання HEX кольору
  const getColorHex = (colorName) => {
    const colors = {
      'чорний': '#000000',
      'білий': '#FFFFFF',
      'червоний': '#FF0000',
      'синій': '#0000FF',
      'зелений': '#00FF00',
      'блакитний': '#00BFFF',
      'рожевий': '#FFC0CB',
      'фіолетовий': '#800080',
      'коричневий': '#8B4513',
      'прозорий': '#F0F0F0',
      'матовий': '#E0E0E0',
      'золотий': '#FFD700',
      'срібний': '#C0C0C0'
    };
    return colors[colorName] || '#CCCCCC';
  };

  // Функція для отримання назви матеріалу
  const getMaterialName = (materialId) => {
    const materials = {
      'silicone': 'Силікон',
      'tpu': 'TPU',
      'polycarbonate': 'Полікарбонат',
      'leather': 'Шкіра',
      'carbon-fiber': 'Карбонове волокно',
      'aluminum': 'Алюміній'
    };
    return materials[materialId] || materialId;
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Кошик покупок</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="cart-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <p>Ваш кошик порожній</p>
              <span>Додайте товари з каталогу</span>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {/* Відображаємо КОЖЕН товар окремо, навіть якщо це варіанти одного продукту */}
                {items.map((item, index) => (
                  <div key={item.cartItemId || `${item.id}-${index}`} className="cart-item">
                    <div className="item-image">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="product-image-cart"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/placeholder.jpg';
                        }}
                      />
                    </div>
                    
                    <div className="item-details">
                      <h4 className="item-name">{item.name}</h4>
                      
                      {/* Відображаємо всі варіанти товару */}
                      <div className="item-variants">
                        {/* Модель iPhone */}
                        {item.selectedModel && (
                          <div className="variant-info">
                            <span className="variant-label">Модель:</span>
                            <span className="variant-value">{item.selectedModel}</span>
                          </div>
                        )}
                        
                        {/* Колір */}
                        {item.selectedColor && (
                          <div className="variant-info">
                            <span className="variant-label">Колір:</span>
                            <span className="variant-value">
                              <span 
                                className="color-indicator" 
                                style={{ backgroundColor: getColorHex(item.selectedColor) }}
                                title={item.selectedColor}
                              ></span>
                              {item.selectedColor}
                            </span>
                          </div>
                        )}
                        
                        {/* Розмір/Версія */}
                        {item.selectedSize && (
                          <div className="variant-info">
                            <span className="variant-label">Версія:</span>
                            <span className="variant-value">{item.selectedSize}</span>
                          </div>
                        )}
                        
                        {/* Матеріал */}
                        {item.selectedMaterial && (
                          <div className="variant-info">
                            <span className="variant-label">Матеріал:</span>
                            <span className="variant-value">{getMaterialName(item.selectedMaterial)}</span>
                          </div>
                        )}
                        
                        {/* Тип чохла */}
                        {item.type && (
                          <div className="variant-info">
                            <span className="variant-label">Тип:</span>
                            <span className="variant-value">{item.type}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="item-price">{item.price} ₴</div>
                      
                      <div className="item-controls">
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn"
                            onClick={() => handleDecreaseQuantity(item.cartItemId || item.variantId || item.id)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => handleIncreaseQuantity(item.cartItemId || item.variantId || item.id)}
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="item-total">
                          {item.totalPrice || item.price * item.quantity} ₴
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.cartItemId || item.variantId || item.id)}
                      title="Видалити з кошика"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="cart-total">
                  <span>Загальна сума:</span>
                  <span className="total-price">{totalAmount} ₴</span>
                </div>
                
                <div className="cart-actions">
                  <button 
                    className="continue-shopping" 
                    onClick={onClose}
                  >
                    Продовжити покупки
                  </button>
                  <button 
                    className="checkout-btn"
                    onClick={handleCheckout}
                  >
                    Оформити замовлення
                  </button>
                </div>
                
                <div className="cart-actions-secondary">
                  <button 
                    className="clear-cart-btn"
                    onClick={handleClearCart}
                  >
                    Очистити кошик
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;