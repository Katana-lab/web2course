// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Мокові дані продуктів
const products = [
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
    image: '/images/12.jpeg',
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
    image: '/images/13.jpeg',
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
    image: '/images/14.jpeg',
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
    image: '/images/15.jpeg',
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
    image: '/images/13snock.jpg',
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

// Додаємо статичні файли
app.use(express.static('public'));

// Роут для головної сторінки
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Mock API Server</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: #f5f5f5;
        }
        .container {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
          color: #333;
          border-bottom: 2px solid #3498db;
          padding-bottom: 10px;
        }
        .endpoint {
          background: #f8f9fa;
          padding: 15px;
          margin: 15px 0;
          border-left: 4px solid #3498db;
          border-radius: 5px;
        }
        code {
          background: #2c3e50;
          color: #ecf0f1;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
        }
        .method {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 3px;
          font-weight: bold;
          margin-right: 10px;
        }
        .get { background: #27ae60; color: white; }
        .post { background: #3498db; color: white; }
        .put { background: #f39c12; color: white; }
        .delete { background: #e74c3c; color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>✅ Mock API Server is Running</h1>
        <p>Сервер працює на порту ${PORT}</p>
        
        <h2>Доступні API ендпоінти:</h2>
        
        <div class="endpoint">
          <span class="method get">GET</span>
          <code>/api/products</code>
          <p>Отримати всі продукти</p>
          <small>Параметри: ?sortBy=price-asc&search=iphone&color=червоний&inStock=true</small>
        </div>
        
        <div class="endpoint">
          <span class="method get">GET</span>
          <code>/api/products/:id</code>
          <p>Отримати продукт за ID</p>
        </div>
        
        <div class="endpoint">
          <span class="method get">GET</span>
          <code>/api/products/filters</code>
          <p>Отримати опції для фільтрів</p>
        </div>
        
        <h2>Приклад використання:</h2>
        <ul>
          <li><a href="/api/products" target="_blank">/api/products</a> - всі продукти</li>
          <li><a href="/api/products?sortBy=price-desc&search=silicone" target="_blank">/api/products?sortBy=price-desc&search=silicone</a> - з пошуком та сортуванням</li>
          <li><a href="/api/products/1" target="_blank">/api/products/1</a> - продукт з ID 1</li>
          <li><a href="/api/products/filters" target="_blank">/api/products/filters</a> - фільтри</li>
        </ul>
        
        <h2>React додаток:</h2>
        <p>React додаток працює на <a href="http://localhost:3000" target="_blank">http://localhost:3000</a></p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p><strong>Статус:</strong> <span style="color: #27ae60;">● Онлайн</span></p>
          <p>Запущено: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// API endpoints
app.get('/api/products', (req, res) => {
  console.log('GET /api/products', req.query);
  
  const { 
    sortBy = 'default',
    page = 1,
    limit = 9,
    search = '',
    color = '',
    type = '',
    size = '',
    inStock = ''
  } = req.query;
  
  let filteredProducts = [...products];

  // Пошук за текстом
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm)
    );
  }

  // Фільтрація
  if (color) filteredProducts = filteredProducts.filter(p => p.colors.includes(color));
  if (type) filteredProducts = filteredProducts.filter(p => p.type === type);
  if (size) filteredProducts = filteredProducts.filter(p => p.sizes.includes(size));
  if (inStock === 'true') filteredProducts = filteredProducts.filter(p => p.inStock);

  // Сортування
  if (sortBy && sortBy !== 'default') {
    switch (sortBy) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'new':
        filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }
  }

  // Пагінація
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Додаємо затримку для імітації мережевого запиту
  setTimeout(() => {
    res.json({
      success: true,
      products: paginatedProducts,
      total: filteredProducts.length,
      page: parseInt(page),
      limit: parseInt(limit),
      hasMore: endIndex < filteredProducts.length
    });
  }, 300);
});

app.get('/api/products/:id', (req, res) => {
  console.log(`GET /api/products/${req.params.id}`);
  
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    setTimeout(() => res.json(product), 200);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.get('/api/products/filters', (req, res) => {
  console.log('GET /api/products/filters');
  
  const colors = [...new Set(products.flatMap(p => p.colors))];
  const types = [...new Set(products.map(p => p.type))];
  const sizes = [...new Set(products.flatMap(p => p.sizes))];
  
  setTimeout(() => {
    res.json({ colors, types, sizes });
  }, 200);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Обробка 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`\n✅ Mock API сервер запущено на http://localhost:${PORT}`);
  console.log(`📡 API доступні:`);
  console.log(`   GET http://localhost:${PORT}/api/products`);
  console.log(`   GET http://localhost:${PORT}/api/products?sortBy=price-desc&search=iphone`);
  console.log(`   GET http://localhost:${PORT}/api/products/1`);
  console.log(`   GET http://localhost:${PORT}/api/products/filters`);
  console.log(`\n⚛️  React додаток працює на http://localhost:3000`);
  console.log(`\n🔄 Для зупинки сервера натисніть Ctrl + C\n`);
});