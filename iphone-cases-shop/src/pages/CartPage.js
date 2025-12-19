import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  removeItemFromCart, 
  increaseQuantity, 
  decreaseQuantity, 
  clearCart,
  updateQuantity 
} from '../redux/cartSlice';
import './CartPage.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector(state => state.cart);
  
  const handleRemoveItem = (cartItemId) => {
    dispatch(removeItemFromCart(cartItemId));
  };
  
  const handleIncreaseQuantity = (cartItemId) => {
    dispatch(increaseQuantity(cartItemId));
  };
  
  const handleDecreaseQuantity = (cartItemId) => {
    dispatch(decreaseQuantity(cartItemId));
  };
  
  const handleUpdateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      dispatch(updateQuantity({ id: cartItemId, quantity: newQuantity }));
    }
  };
  
  const handleClearCart = () => {
    if (window.confirm('Ви впевнені, що хочете очистити кошик?')) {
      dispatch(clearCart());
    }
  };
  
  const handleCheckout = () => {
    alert('Оформлення замовлення...');
    // Тут буде логіка оформлення замовлення
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
      'срібний': '#C0C0C0',
      'графітовий': '#424242',
      'міднавий': '#B87333'
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
      'aluminum': 'Алюміній',
      'glass': 'Скло',
      'fabric': 'Тканина'
    };
    return materials[materialId] || materialId;
  };
  
  // Функція для отримання іконки типу
  const getTypeIcon = (type) => {
    const icons = {
      'silicone': '🟣',
      'clear': '🔵',
      'leather': '🟤',
      'premium': '⭐',
      'magsafe': '🧲',
      'anti-shock': '🛡️',
      'waterproof': '💧',
      'wallet': '👛'
    };
    return icons[type] || '📱';
  };
  
  // Функція для групування товарів за основним ID (опційно)
  const groupItemsByProduct = () => {
    const groups = {};
    
    items.forEach(item => {
      const key = item.id; // Групуємо по основному ID продукту
      if (!groups[key]) {
        groups[key] = {
          product: item,
          variants: [],
          totalQuantity: 0,
          totalPrice: 0
        };
      }
      groups[key].variants.push(item);
      groups[key].totalQuantity += item.quantity;
      groups[key].totalPrice += item.totalPrice || item.price * item.quantity;
    });
    
    return Object.values(groups);
  };
  
  if (items.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="container">
          <div className="empty-cart-content">
            <div className="empty-cart-icon">🛒</div>
            <h1>Ваш кошик порожній</h1>
            <p>Додайте товари, щоб зробити покупку</p>
            <Link to="/catalog" className="continue-shopping-btn">
              Перейти до каталогу
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const groupedItems = groupItemsByProduct();
  
  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Кошик покупок</h1>
        <p className="cart-subtitle">У кошику {totalQuantity} товар(ів)</p>
        
        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-items-header">
              <div className="cart-items-title">Товари в кошику</div>
              <button 
                className="clear-cart-btn"
                onClick={handleClearCart}
              >
                Очистити кошик
              </button>
            </div>
            
            <div className="cart-items-list">
              {/* Відображаємо групи товарів */}
              {groupedItems.map((group, groupIndex) => (
                <div key={group.product.id} className="product-group">
                  <div className="product-group-header">
                    <h3 className="product-group-title">
                      {group.product.name} 
                      <span className="product-group-count">
                        ({group.totalQuantity} шт. • {group.totalPrice} ₴)
                      </span>
                    </h3>
                  </div>
                  
                  <div className="product-variants">
                    {group.variants.map((item, index) => (
                      <div key={item.cartItemId || `${item.id}-${index}`} className="cart-item-page">
                        <div className="cart-item-image">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/placeholder.jpg';
                            }}
                          />
                          {item.isNew && <span className="new-badge">NEW</span>}
                        </div>
                        
                        <div className="cart-item-details">
                          <h3 className="cart-item-name">
                            <Link to={`/product/${item.id}`}>{item.name}</Link>
                          </h3>
                          
                          <div className="cart-item-variants">
                            {/* Іконка типу */}
                            <div className="cart-item-type">
                              <span className="type-icon">{getTypeIcon(item.type)}</span>
                              <span className="type-name">{item.type || 'Чохол'}</span>
                            </div>
                            
                            {/* Модель iPhone */}
                            {item.selectedModel && (
                              <div className="cart-item-model">
                                <span className="model-label">Модель:</span>
                                <span className="model-value">{item.selectedModel}</span>
                              </div>
                            )}
                            
                            {/* Колір */}
                            {item.selectedColor && (
                              <div className="cart-item-color">
                                <span className="color-label">Колір:</span>
                                <span className="color-value">
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
                              <div className="cart-item-size">
                                <span className="size-label">Версія:</span>
                                <span className="size-value">{item.selectedSize}</span>
                              </div>
                            )}
                            
                            {/* Матеріал */}
                            {item.selectedMaterial && (
                              <div className="cart-item-material">
                                <span className="material-label">Матеріал:</span>
                                <span className="material-value">{getMaterialName(item.selectedMaterial)}</span>
                              </div>
                            )}
                            
                            {/* Фініш */}
                            {item.selectedFinish && (
                              <div className="cart-item-finish">
                                <span className="finish-label">Фініш:</span>
                                <span className="finish-value">{item.selectedFinish}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="cart-item-features">
                            {item.features && item.features.slice(0, 2).map((feature, idx) => (
                              <span key={idx} className="feature-tag">✓ {feature}</span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="cart-item-price">
                          <div className="price-amount">{item.price} ₴</div>
                          {item.originalPrice && (
                            <div className="original-price">{item.originalPrice} ₴</div>
                          )}
                        </div>
                        
                        <div className="cart-item-quantity">
                          <div className="quantity-controls-page">
                            <button 
                              className="quantity-btn-page decrease"
                              onClick={() => handleDecreaseQuantity(item.cartItemId || item.variantId || item.id)}
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            
                            <input
                              type="number"
                              min="1"
                              max="99"
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(
                                item.cartItemId || item.variantId || item.id, 
                                parseInt(e.target.value) || 1
                              )}
                              className="quantity-input"
                            />
                            
                            <button 
                              className="quantity-btn-page increase"
                              onClick={() => handleIncreaseQuantity(item.cartItemId || item.variantId || item.id)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        <div className="cart-item-total">
                          <div className="total-amount">{item.totalPrice || item.price * item.quantity} ₴</div>
                          <div className="per-item">({item.price} ₴ × {item.quantity})</div>
                        </div>
                        
                        <div className="cart-item-remove">
                          <button 
                            className="remove-item-btn-page"
                            onClick={() => handleRemoveItem(item.cartItemId || item.variantId || item.id)}
                            title="Видалити товар"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="continue-shopping-section">
              <Link to="/catalog" className="continue-shopping-link-page">
                ← Продовжити покупки
              </Link>
            </div>
          </div>
          
          <div className="order-summary">
            <h2 className="summary-title">Підсумок замовлення</h2>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Кількість товарів:</span>
                <span>{totalQuantity}</span>
              </div>
              
              <div className="summary-row">
                <span>Вартість товарів:</span>
                <span>{totalAmount} ₴</span>
              </div>
              
              <div className="summary-row">
                <span>Знижка:</span>
                <span className="discount">-0 ₴</span>
              </div>
              
              <div className="summary-row">
                <span>Доставка:</span>
                <span className="free-shipping">Безкоштовно</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total-row">
                <span>Загальна сума:</span>
                <span className="total-amount">{totalAmount} ₴</span>
              </div>
              
              <div className="summary-row vat-row">
                <span>У тому числі ПДВ:</span>
                <span>{(totalAmount * 0.2).toFixed(2)} ₴</span>
              </div>
            </div>
            
            <button 
              className="checkout-btn-page"
              onClick={handleCheckout}
            >
              Перейти до оформлення
            </button>
            
            <div className="promo-code">
              <input
                type="text"
                placeholder="Промокод"
                className="promo-input"
              />
              <button className="promo-btn">Застосувати</button>
            </div>
            
            <div className="secure-checkout">
              <div className="secure-info">
                <span className="lock-icon">🔒</span>
                <span>Безпечна оплата</span>
              </div>
              <div className="payment-icons">
                <span className="payment-icon" title="Visa">💳</span>
                <span className="payment-icon" title="Mastercard">🏦</span>
                <span className="payment-icon" title="Apple Pay">📱</span>
                <span className="payment-icon" title="Google Pay">🤖</span>
                <span className="payment-icon" title="Privat24">💰</span>
              </div>
            </div>
            
            <div className="shipping-info">
              <h4>Доставка:</h4>
              <ul>
                <li>🚚 Нова Пошта - 1-2 дні</li>
                <li>📦 Укрпошта - 2-4 дні</li>
                <li>🚗 Самовивіз з магазину</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;