// components/ProductGrid.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../redux/cartSlice';
import './ProductGrid.css';
import ProductCard from './ProductCard';
import Loader from './Loader';
import { productApi } from '../api/api';

const ProductGrid = ({ sortBy, setSortBy }) => {
  const dispatch = useDispatch();
  
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(6);
  const [showMoreContent, setShowMoreContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);

  // Функція для завантаження продуктів з сервера
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        sortBy: sortBy || 'default',
        page: 1,
        limit: visibleProducts
      };

      console.log('Запит продуктів з параметрами:', params);
      
      const data = await productApi.getAllProducts(params);
      
      if (data.success) {
        setProducts(data.products);
        setTotalProducts(data.total);
        console.log('Отримано продуктів:', data.products.length);
      } else {
        throw new Error(data.error || 'Помилка завантаження продуктів');
      }
    } catch (err) {
      console.error('Помилка завантаження продуктів:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Завантажуємо продукти при зміні сортування або кількості видимих продуктів
  useEffect(() => {
    fetchProducts();
  }, [sortBy, visibleProducts]);

  // Функція для додавання до кошика
  const handleAddToCart = (product) => {
    const productToAdd = {
      ...product,
      quantity: 1
    };
    
    dispatch(addItemToCart(productToAdd));
    alert(`✅ ${product.name} додано до кошика!`);
  };

  const handleViewMore = () => {
    setVisibleProducts(prev => prev + 3);
  };

  const handleShowMoreContent = () => {
    setShowMoreContent(prev => !prev);
  };

  if (loading && products.length === 0) {
    return (
      <div className="loading-container">
        <Loader />
        <p>Завантаження популярних товарів...</p>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="error-container">
        <h2>Помилка завантаження товарів</h2>
        <p>{error}</p>
        <button onClick={fetchProducts} className="retry-btn">
          Спробувати ще раз
        </button>
      </div>
    );
  }

  return (
    <section className="product-grid">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Популярні чохли</h2>
          <div className="header-actions">
            <div className="sort-controls">
              <label htmlFor="sort-select">Сортувати за:</label>
              <select 
                id="sort-select"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="default">За замовчуванням</option>
                <option value="price-asc">Ціна (від дешевших)</option>
                <option value="price-desc">Ціна (від дорожчих)</option>
                <option value="name">Назва</option>
                <option value="rating">Рейтинг</option>
                <option value="new">Новинки</option>
              </select>
            </div>
            <Link to="/catalog" className="catalog-link">
              <button className="catalog-button">Весь каталог</button>
            </Link>
          </div>
        </div>

        <div className="products-container">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {products.length < totalProducts && (
          <div className="view-more-section">
            <button className="view-more-btn" onClick={handleViewMore}>
              Показати ще товари
            </button>
            <span className="products-count">
              Показано {products.length} з {totalProducts} товарів
            </span>
          </div>
        )}

        <div className="additional-content">
          <button className="content-toggle-btn" onClick={handleShowMoreContent}>
            {showMoreContent ? 'Приховати додаткову інформацію' : 'Дізнатися більше про наші чохли'}
          </button>
          
          {showMoreContent && (
            <div className="expanded-content">
              <h3>Чому обирають наші чохли для iPhone?</h3>
              <p>Наші чохли виготовлені з найякісніших матеріалів, що забезпечують надійний захист вашого смартфона від ударів, подряпин та інших пошкоджень.</p>
              
              <h4>Переваги наших чохлів:</h4>
              <ul>
                <li>✅ Прецізійне виробництво - ідеальне прилягання</li>
                <li>✅ Сертифіковані матеріали - безпека для здоров'я</li>
                <li>✅ Різноманітний дизайн - для будь-якого смаку</li>
                <li>✅ Підтримка бездротової зарядки</li>
                <li>✅ Гарантія якості - 12 місяців</li>
              </ul>

              <h4>Як доглядати за чохлом?</h4>
              <p>Для продовження терміну служби рекомендуємо регулярно очищати чохол м'якою тканиною, уникати контакту з агресивними хімічними речовинами та захищати від прямого сонячного проміння.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;