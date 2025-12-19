import React, { createContext, useState, useContext, useEffect } from 'react';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};


export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Завантажити всі продукти
  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching all products...');
      
      const response = await fetch('http://localhost:5000/api/products');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Loaded ${data.length} products`);
      
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Не вдалося завантажити товари');
      
      // Fallback дані
      const fallbackData = [
        {
          id: 1,
          name: 'Чохол Silicone Case для iPhone 15 Pro',
          price: 899,
          image: '/images/11.jpg',
          colors: ['червоний', 'чорний', 'блакитний'],
          sizes: ['iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max'],
          type: 'silicone',
          isNew: true,
          rating: 4.5,
          description: 'Преміум силіконовий чохол з оптимальним захистом та стильним дизайном.',
          features: ['Антиударний захист', 'М\'який на дотик', 'Підтримка бездротової зарядки'],
          inStock: true
        },
        {
          id: 2,
          name: 'Чохол Clear Case для iPhone 15',
          price: 759,
          image: require('../assets/images/12.jpeg'),
          colors: ['прозорий', 'матовий'],
          sizes: ['iPhone 15', 'iPhone 15 Plus'],
          type: 'clear',
          isNew: false,
          rating: 4.2,
          description: 'Прозорий чохол, що підкреслює природну красу вашого iPhone.',
          features: ['Кристально чистий', 'Захист від подряпин', 'Тонкий дизайн'],
          inStock: true
        },
        {
          id: 3,
          name: 'Чохол Leather Case для iPhone 14 Pro',
          price: 1299,
          image: require('../assets/images/13.jpeg'),
          colors: ['коричневий', 'чорний'],
          sizes: ['iPhone 14 Pro', 'iPhone 14 Pro Max'],
          type: 'leather',
          isNew: true,
          rating: 4.8,
          description: 'Шкіряний чохол преміум якості з елегантним дизайном.',
          features: ['Натуральна шкіра', 'Патина часу', 'Елегантний вигляд'],
          inStock: true
        }
      ];
      
      setProducts(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Завантажити продукт за ID
  const fetchProductById = async (id) => {
    try {
      console.log(`Fetching product with ID: ${id}`);
      
      // Спочатку пробуємо знайти в локальних даних
      const localProduct = products.find(p => p.id === parseInt(id));
      if (localProduct) {
        console.log('Found product in local data:', localProduct.name);
        return localProduct;
      }

      // Якщо немає локально, робимо запит до API
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response for product:', data);
      return data;
      
    } catch (err) {
      console.error(`Error fetching product ${id}:`, err);
      
      // Якщо API не працює, шукаємо в fallback даних
      const fallbackData = [
        {
          id: 1,
          name: 'Чохол Silicone Case для iPhone 15 Pro',
          price: 899,
          image: require('../assets/images/11.jpg'),
          colors: ['червоний', 'чорний', 'блакитний'],
          sizes: ['iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max'],
          type: 'silicone',
          isNew: true,
          rating: 4.5,
          description: 'Преміум силіконовий чохол з оптимальним захистом та стильним дизайном.',
          features: ['Антиударний захист', 'М\'який на дотик', 'Підтримка бездротової зарядки'],
          inStock: true
        },
        {
          id: 2,
          name: 'Чохол Clear Case для iPhone 15',
          price: 759,
          image: require('../assets/images/12.jpeg'),
          colors: ['прозорий', 'матовий'],
          sizes: ['iPhone 15', 'iPhone 15 Plus'],
          type: 'clear',
          isNew: false,
          rating: 4.2,
          description: 'Прозорий чохол, що підкреслює природну красу вашого iPhone.',
          features: ['Кристально чистий', 'Захист від подряпин', 'Тонкий дизайн'],
          inStock: true
        },
        {
          id: 3,
          name: 'Чохол Leather Case для iPhone 14 Pro',
          price: 1299,
          image: require('../assets/images/13.jpeg'),
          colors: ['коричневий', 'чорний'],
          sizes: ['iPhone 14 Pro', 'iPhone 14 Pro Max'],
          type: 'leather',
          isNew: true,
          rating: 4.8,
          description: 'Шкіряний чохол преміум якості з елегантним дизайном.',
          features: ['Натуральна шкіра', 'Патина часу', 'Елегантний вигляд'],
          inStock: true
        }
      ];
      
      const fallbackProduct = fallbackData.find(p => p.id === parseInt(id));
      if (fallbackProduct) {
        console.log('Found product in fallback data:', fallbackProduct.name);
        return fallbackProduct;
      }
      
      throw new Error(`Product with ID ${id} not found`);
    }
  };

  // Завантажити дані при монтажі
  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    fetchProductById
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};