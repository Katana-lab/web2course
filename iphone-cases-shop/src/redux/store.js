import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

const cartPersistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  if (action.type.startsWith('cart/')) {
    const cartState = store.getState().cart;
    
    try {
      localStorage.setItem('iphone_shop_cart', JSON.stringify(cartState));
    } catch (error) {
      console.error('Помилка збереження кошика:', error);
    }
  }
  
  return result;
};

const loadCartMiddleware = (store) => {
  try {
    const savedCart = localStorage.getItem('iphone_shop_cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      
      if (parsedCart) {
      }
    }
  } catch (error) {
    console.error('Помилка завантаження кошика:', error);
  }
  
  return (next) => (action) => next(action);
};

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartPersistenceMiddleware, loadCartMiddleware),
});

export default store;