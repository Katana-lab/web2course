const express = require('express');
const cors = require('cors');

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
  // ... інші продукти
];

// API endpoints
app.get('/api/products', (req, res) => {
  const { sort, color, type, size, inStock, search } = req.query;
  let filteredProducts = [...products];

  // Фільтрація
  if (color) filteredProducts = filteredProducts.filter(p => p.colors.includes(color));
  if (type) filteredProducts = filteredProducts.filter(p => p.type === type);
  if (size) filteredProducts = filteredProducts.filter(p => p.sizes.includes(size));
  if (inStock === 'true') filteredProducts = filteredProducts.filter(p => p.inStock);
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Сортування
  if (sort) {
    switch (sort) {
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

  // Додаємо затримку для імітації мережевого запиту
  setTimeout(() => {
    res.json(filteredProducts);
  }, 500);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    setTimeout(() => res.json(product), 300);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.get('/api/products/filters', (req, res) => {
  const colors = [...new Set(products.flatMap(p => p.colors))];
  const types = [...new Set(products.map(p => p.type))];
  const sizes = [...new Set(products.flatMap(p => p.sizes))];
  
  res.json({ colors, types, sizes });
});

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
});