// api/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export const productApi = {
  // Отримати всі продукти з параметрами
  getAllProducts: async (params = {}) => {
    try {
      const defaultParams = {
        sortBy: 'default',
        page: 1,
        limit: 9,
        ...params
      };
      
      const response = await api.get('/products', { params: defaultParams });
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.warn('API недоступний, використовуються локальні дані');
      return getLocalProductsWithParams(params);
    }
  },

  // Отримати продукт за ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Product ${id} not found in API, using local data`);
      const localProducts = getLocalProducts();
      return localProducts.find(p => p.id === parseInt(id)) || null;
    }
  },

  // Отримати опції для фільтрів
  getFilterOptions: async () => {
    try {
      const response = await api.get('/products/filters');
      return response.data;
    } catch (error) {
      console.warn('Filter options API недоступний, використовуються локальні дані');
      const products = getLocalProducts();
      const colors = [...new Set(products.flatMap(p => p.colors))];
      const types = [...new Set(products.map(p => p.type))];
      const sizes = [...new Set(products.flatMap(p => p.sizes))];
      return { colors, types, sizes };
    }
  }
};

// Локальні дані (fallback)
const getLocalProducts = () => {
  return [
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
    },
    {
      id: 4,
      name: 'Чохол Sport Case для iPhone 13',
      price: 659,
      image: require('../assets/images/14.jpeg'),
      colors: ['синій', 'рожевий', 'зелений'],
      sizes: ['iPhone 13', 'iPhone 13 mini'],
      type: 'sport',
      isNew: false,
      rating: 4.0,
      description: 'Спортивний чохол з підвищеним захистом для активного способу життя.',
      features: ['Посилений захист', 'Антиковзне покриття', 'Легкий'],
      inStock: true
    },
    {
      id: 5,
      name: 'Чохол Wallet Case для iPhone 15 Pro Max',
      price: 1499,
      image: require('../assets/images/15.jpeg'),
      colors: ['чорний', 'коричневий'],
      sizes: ['iPhone 15 Pro Max'],
      type: 'wallet',
      isNew: true,
      rating: 4.7,
      description: 'Чохол-гаманець з відділенням для карток та готівки.',
      features: ['3 відділення для карток', 'Міцне закриття', 'Стильний дизайн'],
      inStock: false
    },
    {
      id: 6,
      name: 'Чохол Battery Case для iPhone 14',
      price: 1799,
      image: require('../assets/images/13snock.jpg'),
      colors: ['білий', 'чорний'],
      sizes: ['iPhone 14', 'iPhone 14 Plus'],
      type: 'battery',
      isNew: false,
      rating: 4.3,
      description: 'Чохол з вбудованим акумулятором для подовження роботи iPhone.',
      features: ['Додатковий акумулятор', 'Індикатор заряду', 'Швидка зарядка'],
      inStock: true
    }
  ];
};

// Локальна фільтрація з параметрами
const getLocalProductsWithParams = (params = {}) => {
  const products = getLocalProducts();
  let filtered = [...products];

  // Пошук
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm)
    );
  }

  // Фільтрація за кольором
  if (params.color) {
    filtered = filtered.filter(p => p.colors.includes(params.color));
  }
  
  // Фільтрація за типом
  if (params.type) {
    filtered = filtered.filter(p => p.type === params.type);
  }
  
  // Фільтрація за розміром
  if (params.size) {
    filtered = filtered.filter(p => p.sizes.includes(params.size));
  }
  
  // Фільтрація за наявністю
  if (params.inStock) {
    filtered = filtered.filter(p => p.inStock);
  }

  // Сортування
  if (params.sortBy && params.sortBy !== 'default') {
    switch (params.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'new':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }
  }

  // Пагінація
  const page = params.page || 1;
  const limit = params.limit || 9;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    success: true,
    products: paginated,
    total: filtered.length,
    page: page,
    limit: limit,
    hasMore: (startIndex + limit) < filtered.length
  };
};

export default api;