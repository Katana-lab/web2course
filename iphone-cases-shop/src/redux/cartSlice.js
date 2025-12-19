import { createSlice } from '@reduxjs/toolkit';

// Конфігурація варіантів
const VARIANT_CONFIG = {
  // Моделі iPhone
  models: [
    { id: 'iphone-15', name: 'iPhone 15', series: '15', priceModifier: 0 },
    { id: 'iphone-15-plus', name: 'iPhone 15 Plus', series: '15', priceModifier: 50 },
    { id: 'iphone-15-pro', name: 'iPhone 15 Pro', series: '15', priceModifier: 100 },
    { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max', series: '15', priceModifier: 150 },
    { id: 'iphone-14', name: 'iPhone 14', series: '14', priceModifier: -20 },
    { id: 'iphone-14-plus', name: 'iPhone 14 Plus', series: '14', priceModifier: 30 },
    { id: 'iphone-14-pro', name: 'iPhone 14 Pro', series: '14', priceModifier: 80 },
    { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', series: '14', priceModifier: 120 },
    { id: 'iphone-13', name: 'iPhone 13', series: '13', priceModifier: -40 },
    { id: 'iphone-13-pro', name: 'iPhone 13 Pro', series: '13', priceModifier: 70 },
    { id: 'iphone-13-pro-max', name: 'iPhone 13 Pro Max', series: '13', priceModifier: 100 },
    { id: 'iphone-12', name: 'iPhone 12', series: '12', priceModifier: -60 },
    { id: 'iphone-12-pro', name: 'iPhone 12 Pro', series: '12', priceModifier: 50 },
    { id: 'iphone-12-pro-max', name: 'iPhone 12 Pro Max', series: '12', priceModifier: 80 },
    { id: 'iphone-se-2022', name: 'iPhone SE (2022)', series: 'se', priceModifier: -80 },
    { id: 'iphone-se-2020', name: 'iPhone SE (2020)', series: 'se', priceModifier: -90 }
  ],
  
  // Кольори
  colors: [
    { id: 'black', name: 'Чорний', hex: '#000000', priceModifier: 0 },
    { id: 'white', name: 'Білий', hex: '#FFFFFF', priceModifier: 0 },
    { id: 'red', name: 'Червоний', hex: '#FF0000', priceModifier: 20 },
    { id: 'blue', name: 'Синій', hex: '#0000FF', priceModifier: 20 },
    { id: 'green', name: 'Зелений', hex: '#00FF00', priceModifier: 20 },
    { id: 'pink', name: 'Рожевий', hex: '#FFC0CB', priceModifier: 25 },
    { id: 'purple', name: 'Фіолетовий', hex: '#800080', priceModifier: 25 },
    { id: 'gold', name: 'Золотий', hex: '#FFD700', priceModifier: 50 },
    { id: 'silver', name: 'Срібний', hex: '#C0C0C0', priceModifier: 50 },
    { id: 'transparent', name: 'Прозорий', hex: '#F0F0F0', priceModifier: 0 },
    { id: 'matte-black', name: 'Матовий чорний', hex: '#1A1A1A', priceModifier: 30 },
    { id: 'space-gray', name: 'Космічний сірий', hex: '#8E8E93', priceModifier: 30 },
    { id: 'midnight', name: 'Опівнічний', hex: '#1D2951', priceModifier: 40 },
    { id: 'starlight', name: 'Зоряне сяйво', hex: '#F5F5F7', priceModifier: 40 }
  ],
  
  // Матеріали
  materials: [
    { id: 'silicone', name: 'Силікон', priceModifier: 0, weight: 'легкий' },
    { id: 'tpu', name: 'TPU', priceModifier: -20, weight: 'легкий' },
    { id: 'polycarbonate', name: 'Полікарбонат', priceModifier: 30, weight: 'середній' },
    { id: 'leather', name: 'Шкіра', priceModifier: 150, weight: 'середній' },
    { id: 'carbon-fiber', name: 'Карбонове волокно', priceModifier: 200, weight: 'легкий' },
    { id: 'aluminum', name: 'Алюміній', priceModifier: 100, weight: 'важкий' },
    { id: 'magsafe', name: 'MagSafe', priceModifier: 80, weight: 'легкий' },
    { id: 'hybrid', name: 'Гібридний', priceModifier: 60, weight: 'середній' }
  ],
  
  // Захист
  protection: [
    { id: 'basic', name: 'Базовий', level: 1, priceModifier: 0 },
    { id: 'military', name: 'Військовий стандарт', level: 2, priceModifier: 100 },
    { id: 'premium', name: 'Преміум захист', level: 3, priceModifier: 200 },
    { id: 'waterproof', name: 'Водонепроникний', level: 3, priceModifier: 150 }
  ]
};

// Функція для завантаження стану з localStorage
const loadCartFromStorage = () => {
  if (typeof window === 'undefined') {
    return {
      items: [],
      totalQuantity: 0,
      totalAmount: 0,
    };
  }
  
  try {
    const serializedCart = localStorage.getItem('iphone_shop_cart');
    if (serializedCart === null) {
      return undefined;
    }
    
    const parsedCart = JSON.parse(serializedCart);
    
    // Валідація даних з localStorage
    const validatedCart = {
      items: Array.isArray(parsedCart.items) ? parsedCart.items : [],
      totalQuantity: typeof parsedCart.totalQuantity === 'number' ? parsedCart.totalQuantity : 0,
      totalAmount: typeof parsedCart.totalAmount === 'number' ? parsedCart.totalAmount : 0,
    };
    
    // Забезпечуємо наявність cartItemId у всіх елементах
    validatedCart.items = validatedCart.items.map((item, index) => ({
      ...item,
      cartItemId: item.cartItemId || `item_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
      quantity: item.quantity || 1,
      totalPrice: item.totalPrice || (item.price || 0) * (item.quantity || 1)
    }));
    
    // Перераховуємо загальні значення
    validatedCart.totalQuantity = validatedCart.items.reduce((total, item) => total + (item.quantity || 1), 0);
    validatedCart.totalAmount = validatedCart.items.reduce((total, item) => total + (item.totalPrice || (item.price || 0) * (item.quantity || 1)), 0);
    
    return validatedCart;
  } catch (error) {
    console.error('Помилка завантаження кошика з localStorage:', error);
    
    // У разі помилки - очищаємо localStorage
    localStorage.removeItem('iphone_shop_cart');
    
    return {
      items: [],
      totalQuantity: 0,
      totalAmount: 0,
    };
  }
};

// Функція для збереження стану в localStorage
const saveCartToStorage = (state) => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    const cartToSave = {
      items: state.items,
      totalQuantity: state.totalQuantity,
      totalAmount: state.totalAmount,
    };
    
    localStorage.setItem('iphone_shop_cart', JSON.stringify(cartToSave));
  } catch (error) {
    console.error('Помилка збереження кошика в localStorage:', error);
  }
};

// Початковий стан з localStorage
const savedCart = loadCartFromStorage();
const initialState = savedCart || {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

// Генерація унікального ID для варіанту
const generateVariantId = (item) => {
  const variantParts = [
    `prod-${item.id}`,
    `model-${item.selectedModelId || 'default'}`,
    `color-${item.selectedColorId || 'default'}`,
    `material-${item.selectedMaterialId || 'default'}`,
    `protection-${item.selectedProtectionId || 'default'}`,
  ];
  return variantParts.join('_');
};

// Розрахунок фінальної ціни з урахуванням варіантів
const calculateFinalPrice = (basePrice, variant) => {
  let finalPrice = basePrice;
  
  // Додаємо модифікатори цін за варіантами
  if (variant.selectedModelId) {
    const model = VARIANT_CONFIG.models.find(m => m.id === variant.selectedModelId);
    if (model) finalPrice += model.priceModifier;
  }
  
  if (variant.selectedColorId) {
    const color = VARIANT_CONFIG.colors.find(c => c.id === variant.selectedColorId);
    if (color) finalPrice += color.priceModifier;
  }
  
  if (variant.selectedMaterialId) {
    const material = VARIANT_CONFIG.materials.find(m => m.id === variant.selectedMaterialId);
    if (material) finalPrice += material.priceModifier;
  }
  
  if (variant.selectedProtectionId) {
    const protection = VARIANT_CONFIG.protection.find(p => p.id === variant.selectedProtectionId);
    if (protection) finalPrice += protection.priceModifier;
  }
  
  return finalPrice > 0 ? finalPrice : basePrice;
};

// Функція для оновлення загальних показників кошика
const updateCartTotals = (state) => {
  state.totalQuantity = state.items.reduce((total, item) => total + (item.quantity || 1), 0);
  state.totalAmount = state.items.reduce((total, item) => total + (item.totalPrice || (item.price || 0) * (item.quantity || 1)), 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Додати товар з варіантами
    addItemToCart(state, action) {
      const item = action.payload;
      
      // Генеруємо унікальний ID для цього конкретного варіанту
      const variantId = generateVariantId(item);
      
      // Розраховуємо фінальну ціну
      const finalPrice = calculateFinalPrice(item.price || item.basePrice || 0, item);
      
      // Створюємо об'єкт товару для кошика
      const cartItem = {
        // Основна інформація
        id: item.id,
        name: item.name,
        basePrice: item.price || item.basePrice || 0,
        price: finalPrice,
        image: item.image,
        type: item.type,
        
        // Варіанти
        selectedModelId: item.selectedModelId,
        selectedModelName: item.selectedModelName,
        selectedColorId: item.selectedColorId,
        selectedColorName: item.selectedColorName,
        selectedMaterialId: item.selectedMaterialId,
        selectedMaterialName: item.selectedMaterialName,
        selectedProtectionId: item.selectedProtectionId,
        selectedProtectionName: item.selectedProtectionName,
        
        // Додаткові характеристики
        isNew: item.isNew || false,
        rating: item.rating || 0,
        inStock: item.inStock !== false,
        
        // Дані для кошика
        variantId: variantId,
        cartItemId: item.cartItemId || `${variantId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        quantity: item.quantity || 1,
        totalPrice: finalPrice * (item.quantity || 1),
        addedAt: new Date().toISOString(),
        
        // Прапорці для відображення
        isVariant: true,
        showAsSeparate: true
      };
      
      // ЗАВЖДИ додаємо як новий товар (навіть якщо це варіант того самого продукту)
      state.items.push(cartItem);
      
      // Оновлюємо загальні показники
      updateCartTotals(state);
      
      // Зберігаємо в localStorage
      saveCartToStorage(state);
    },
    
    // Видалити конкретний варіант
    removeItemFromCart(state, action) {
      const cartItemId = action.payload;
      state.items = state.items.filter(item => item.cartItemId !== cartItemId);
      
      updateCartTotals(state);
      saveCartToStorage(state);
    },
    
    // Змінити кількість
    updateQuantity(state, action) {
      const { cartItemId, quantity } = action.payload;
      const item = state.items.find(item => item.cartItemId === cartItemId);
      
      if (item && quantity >= 1 && quantity <= 99) {
        const oldQuantity = item.quantity || 1;
        item.quantity = quantity;
        item.totalPrice = item.price * quantity;
        
        // Перераховуємо загальні суми
        state.totalQuantity += (quantity - oldQuantity);
        state.totalAmount += item.price * (quantity - oldQuantity);
        
        saveCartToStorage(state);
      }
    },
    
    // Збільшити на 1
    increaseQuantity(state, action) {
      const cartItemId = action.payload;
      const item = state.items.find(item => item.cartItemId === cartItemId);
      
      if (item && (item.quantity || 1) < 99) {
        const oldQuantity = item.quantity || 1;
        item.quantity = oldQuantity + 1;
        item.totalPrice = item.price * item.quantity;
        
        state.totalQuantity += 1;
        state.totalAmount += item.price;
        
        saveCartToStorage(state);
      }
    },
    
    // Зменшити на 1
    decreaseQuantity(state, action) {
      const cartItemId = action.payload;
      const item = state.items.find(item => item.cartItemId === cartItemId);
      
      if (item && (item.quantity || 1) > 1) {
        const oldQuantity = item.quantity || 1;
        item.quantity = oldQuantity - 1;
        item.totalPrice = item.price * item.quantity;
        
        state.totalQuantity -= 1;
        state.totalAmount -= item.price;
        
        saveCartToStorage(state);
      }
    },
    
    // Очистити кошик
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('iphone_shop_cart');
      }
    },
    
    // Синхронізувати з localStorage (можна викликати при завантаженні компонента)
    syncCartWithStorage(state) {
      const savedCart = loadCartFromStorage();
      if (savedCart) {
        state.items = savedCart.items || [];
        state.totalQuantity = savedCart.totalQuantity || 0;
        state.totalAmount = savedCart.totalAmount || 0;
      }
    },
    
    // Оновити варіант товару
    updateCartItemVariant(state, action) {
      const { cartItemId, newVariant } = action.payload;
      const itemIndex = state.items.findIndex(item => item.cartItemId === cartItemId);
      
      if (itemIndex !== -1) {
        const oldItem = state.items[itemIndex];
        
        // Створюємо новий варіант
        const updatedItem = {
          ...oldItem,
          ...newVariant,
          variantId: generateVariantId({ ...oldItem, ...newVariant }),
          cartItemId: `${generateVariantId({ ...oldItem, ...newVariant })}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          price: calculateFinalPrice(oldItem.basePrice, { ...oldItem, ...newVariant }),
          totalPrice: calculateFinalPrice(oldItem.basePrice, { ...oldItem, ...newVariant }) * (oldItem.quantity || 1)
        };
        
        // Перевіряємо, чи такий варіант вже є
        const existingDuplicate = state.items.find((item, idx) => 
          idx !== itemIndex && 
          item.variantId === updatedItem.variantId
        );
        
        if (existingDuplicate) {
          // Об'єднуємо кількості
          existingDuplicate.quantity = (existingDuplicate.quantity || 1) + (oldItem.quantity || 1);
          existingDuplicate.totalPrice = existingDuplicate.price * existingDuplicate.quantity;
          
          // Видаляємо старий
          state.items.splice(itemIndex, 1);
        } else {
          // Замінюємо старий варіант на новий
          state.items[itemIndex] = updatedItem;
        }
        
        updateCartTotals(state);
        saveCartToStorage(state);
      }
    },
    
    // Примусове збереження (можна викликати перед закриттям сторінки)
    forceSaveCart(state) {
      saveCartToStorage(state);
    }
  },
});

// Експортуємо константи для використання в компонентах
export const VARIANT_OPTIONS = VARIANT_CONFIG;

export const { 
  addItemToCart, 
  removeItemFromCart, 
  increaseQuantity, 
  decreaseQuantity,
  updateQuantity,
  clearCart,
  syncCartWithStorage,
  updateCartItemVariant,
  forceSaveCart
} = cartSlice.actions;

export default cartSlice.reducer;