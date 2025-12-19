import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import './App.css';

// Імпорт компонентів
import Header from './components/Header';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import Footer from './components/Footer';
import Cart from './components/Cart';

function App() {
  const [sortBy, setSortBy] = useState('default');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Функція для завантаження кошика при старті додатку
  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('iphone_shop_cart');
      if (savedCart) {
        // Парсимо та валідуємо дані
        const parsedCart = JSON.parse(savedCart);
        
        // Переконуємося, що дані мають правильну структуру
        if (parsedCart && Array.isArray(parsedCart.items)) {
          console.log('Кошик завантажено з localStorage:', parsedCart.items.length, 'товарів');
        }
      }
    } catch (error) {
      console.error('Помилка завантаження кошика:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Завантажуємо кошик при завантаженні додатку
    loadCartFromStorage();
    
    // Можна також додати обробник для збереження перед закриттям
    const handleBeforeUnload = () => {
      console.log('Збереження кошика перед закриттям...');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      console.log('Додаток завантажено, кошик готовий до використання');
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Завантаження додатку...</p>
      </div>
    );
  }

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Header onCartClick={openCart} />
          <Navigation />
          
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <ProductGrid 
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
              </>
            } />
            <Route path="/catalog" element={
              <CatalogPage 
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            } />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
          
          <Footer />
          
          <Cart 
            isOpen={isCartOpen}
            onClose={closeCart}
          />
        </div>
      </Router>
    </Provider>
  );
}

export default App;