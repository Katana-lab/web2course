// pages/CatalogPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../redux/cartSlice';
import { useDebounce } from '../hooks/useDebounce';
import './CatalogPage.css';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { productApi } from '../api/api';

const CatalogPage = ({ sortBy, setSortBy }) => {
  const dispatch = useDispatch();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    color: '',
    type: '',
    size: '',
    inStock: false,
    search: ''
  });
  
  const [searchInput, setSearchInput] = useState('');
  const [visibleProducts, setVisibleProducts] = useState(9);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filterOptions, setFilterOptions] = useState({
    colors: [],
    types: [],
    sizes: []
  });

  // Використовуємо дебаунс для пошуку
  const debouncedSearch = useDebounce(searchInput, 500);

  // Оновлюємо фільтри при зміні дебаунсованого пошуку
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: debouncedSearch
    }));
    setVisibleProducts(9); // Скидаємо пагінацію при новому пошуку
  }, [debouncedSearch]);

  // Функція для завантаження продуктів з сервера
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        sortBy: sortBy || 'default',
        page: 1,
        limit: visibleProducts,
        search: filters.search || ''
      };

      // Додаємо фільтри до параметрів
      if (filters.color) params.color = filters.color;
      if (filters.type) params.type = filters.type;
      if (filters.size) params.size = filters.size;
      if (filters.inStock) params.inStock = 'true';

      console.log('Запит до API з параметрами:', params);
      
      const data = await productApi.getAllProducts(params);
      
      if (data.success) {
        setProducts(data.products);
        setTotalProducts(data.total);
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

  // Завантажуємо продукти при зміні параметрів
  useEffect(() => {
    fetchProducts();
  }, [sortBy, filters, visibleProducts]);

  // Завантажуємо опції для фільтрів
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await productApi.getFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error('Помилка завантаження фільтрів:', error);
      }
    };
    
    loadFilterOptions();
  }, []);

  // Функція для додавання до кошика
  const handleAddToCart = (product) => {
    const productToAdd = {
      ...product,
      quantity: 1
    };
    
    dispatch(addItemToCart(productToAdd));
    alert(`✅ ${product.name} додано до кошика!`);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setVisibleProducts(9); // Скидаємо пагінацію при зміні фільтрів
  };

  const clearFilters = () => {
    setFilters({
      color: '',
      type: '',
      size: '',
      inStock: false,
      search: ''
    });
    setSearchInput('');
    setVisibleProducts(9);
  };

  const handleViewMore = () => {
    setVisibleProducts(prev => prev + 6);
  };

  // Показуємо Loader при завантаженні
  if (loading && products.length === 0) {
    return (
      <div className="loading-container">
        <Loader />
        <p>Завантаження товарів...</p>
      </div>
    );
  }

  // Показуємо помилку
  if (error && products.length === 0) {
    return (
      <div className="error-container">
        <h2>⚠️ Проблема з завантаженням</h2>
        <p>{error}</p>
        <button onClick={fetchProducts} className="retry-btn">
          Спробувати ще раз
        </button>
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <div className="container">
        <h1 className="catalog-title">Каталог товарів</h1>
        
        <div className="catalog-controls">
          <div className="search-controls">
            <input
              type="text"
              placeholder="Пошук товарів за назвою або описом..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="sort-controls">
            <label htmlFor="catalog-sort">Сортувати за:</label>
            <select 
              id="catalog-sort"
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
        </div>

        <div className="catalog-content">
          <aside className="catalog-sidebar">
            <div className="sidebar-header">
              <h3>Фільтри</h3>
              {(Object.values(filters).some(f => f !== '' && f !== false) || searchInput) && (
                <button className="clear-filters" onClick={clearFilters}>
                  Очистити
                </button>
              )}
            </div>
            
            {filterOptions.colors.length > 0 && (
              <div className="sidebar-section">
                <h4>Колір</h4>
                <div className="filter-options">
                  {filterOptions.colors.map(color => (
                    <label key={color} className="filter-option">
                      <input
                        type="radio"
                        name="color"
                        checked={filters.color === color}
                        onChange={() => handleFilterChange('color', color)}
                      />
                      <span className="color-dot" style={{backgroundColor: getColorCode(color)}}></span>
                      {color}
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            {filterOptions.types.length > 0 && (
              <div className="sidebar-section">
                <h4>Тип чохла</h4>
                <div className="filter-options">
                  {filterOptions.types.map(type => (
                    <label key={type} className="filter-option">
                      <input
                        type="radio"
                        name="type"
                        checked={filters.type === type}
                        onChange={() => handleFilterChange('type', type)}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            {filterOptions.sizes.length > 0 && (
              <div className="sidebar-section">
                <h4>Розмір</h4>
                <div className="filter-options">
                  {filterOptions.sizes.map(size => (
                    <label key={size} className="filter-option">
                      <input
                        type="radio"
                        name="size"
                        checked={filters.size === size}
                        onChange={() => handleFilterChange('size', size)}
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            <div className="sidebar-section">
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                />
                Тільки в наявності
              </label>
            </div>
          </aside>

          <main className="catalog-main">
            <div className="results-info">
              <span>Знайдено {totalProducts} товарів</span>
            </div>

            <div className="catalog-products">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {visibleProducts < totalProducts && (
              <div className="view-more-section">
                <button 
                  className="view-more-btn" 
                  onClick={handleViewMore}
                >
                  Показати ще {Math.min(6, totalProducts - visibleProducts)} товарів
                </button>
              </div>
            )}

            {products.length === 0 && !loading && (
              <div className="no-results">
                <h3>Товари не знайдено</h3>
                <p>Спробуйте змінити параметри пошуку або фільтри</p>
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Очистити фільтри
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// Допоміжна функція для кольорів
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

export default CatalogPage;