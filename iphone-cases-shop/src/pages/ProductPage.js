import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItemToCart, VARIANT_OPTIONS } from '../redux/cartSlice';
import './ProductPage.css';
import Loader from '../components/Loader';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Стани для варіантів
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedColorId, setSelectedColorId] = useState('');
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [selectedProtectionId, setSelectedProtectionId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [finalPrice, setFinalPrice] = useState(0);

  // Завантаження продукту
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        
        if (!response.ok) throw new Error('Помилка завантаження');
        
        const data = await response.json();
        const productData = data.data || data;
        
        setProduct(productData);
        
        // Встановлюємо дефолтні значення варіантів
        if (productData.defaultModel) {
          setSelectedModelId(productData.defaultModel);
        } else if (VARIANT_OPTIONS.models.length > 0) {
          setSelectedModelId(VARIANT_OPTIONS.models[0].id);
        }
        
        if (productData.defaultColor) {
          setSelectedColorId(productData.defaultColor);
        } else if (VARIANT_OPTIONS.colors.length > 0) {
          setSelectedColorId(VARIANT_OPTIONS.colors[0].id);
        }
        
        if (productData.defaultMaterial) {
          setSelectedMaterialId(productData.defaultMaterial);
        } else if (VARIANT_OPTIONS.materials.length > 0) {
          setSelectedMaterialId(VARIANT_OPTIONS.materials[0].id);
        }
        
        if (productData.defaultProtection) {
          setSelectedProtectionId(productData.defaultProtection);
        } else if (VARIANT_OPTIONS.protection.length > 0) {
          setSelectedProtectionId(VARIANT_OPTIONS.protection[0].id);
        }
        
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        
        // Fallback дані
        const fallbackData = {
          id: parseInt(id),
          name: `Чохол преміум якості`,
          price: 899,
          image: '/images/placeholder.jpg',
          description: 'Високоякісний чохол для iPhone',
          features: ['Захист від ударів', 'Підтримка бездротової зарядки'],
          inStock: true
        };
        
        setProduct(fallbackData);
        
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Розрахунок фінальної ціни при зміні варіантів
  useEffect(() => {
    if (product) {
      let calculatedPrice = product.price || 0;
      
      // Додаємо модифікатори варіантів
      const selectedModel = VARIANT_OPTIONS.models.find(m => m.id === selectedModelId);
      if (selectedModel) calculatedPrice += selectedModel.priceModifier;
      
      const selectedColor = VARIANT_OPTIONS.colors.find(c => c.id === selectedColorId);
      if (selectedColor) calculatedPrice += selectedColor.priceModifier;
      
      const selectedMaterial = VARIANT_OPTIONS.materials.find(m => m.id === selectedMaterialId);
      if (selectedMaterial) calculatedPrice += selectedMaterial.priceModifier;
      
      const selectedProtection = VARIANT_OPTIONS.protection.find(p => p.id === selectedProtectionId);
      if (selectedProtection) calculatedPrice += selectedProtection.priceModifier;
      
      setFinalPrice(calculatedPrice > 0 ? calculatedPrice : product.price);
    }
  }, [product, selectedModelId, selectedColorId, selectedMaterialId, selectedProtectionId]);

  // Отримання назв обраних варіантів
  const getSelectedModelName = () => {
    const model = VARIANT_OPTIONS.models.find(m => m.id === selectedModelId);
    return model ? model.name : 'Не обрано';
  };

  const getSelectedColorName = () => {
    const color = VARIANT_OPTIONS.colors.find(c => c.id === selectedColorId);
    return color ? color.name : 'Не обрано';
  };

  const getSelectedMaterialName = () => {
    const material = VARIANT_OPTIONS.materials.find(m => m.id === selectedMaterialId);
    return material ? material.name : 'Не обрано';
  };

  const getSelectedProtectionName = () => {
    const protection = VARIANT_OPTIONS.protection.find(p => p.id === selectedProtectionId);
    return protection ? protection.name : 'Не обрано';
  };

  // Обробка додавання до кошика
  const handleAddToCart = () => {
    if (!product || !product.inStock) return;

    const selectedModel = VARIANT_OPTIONS.models.find(m => m.id === selectedModelId);
    const selectedColor = VARIANT_OPTIONS.colors.find(c => c.id === selectedColorId);
    const selectedMaterial = VARIANT_OPTIONS.materials.find(m => m.id === selectedMaterialId);
    const selectedProtection = VARIANT_OPTIONS.protection.find(p => p.id === selectedProtectionId);

    const productToAdd = {
      ...product,
      // Основна інформація
      basePrice: product.price,
      price: finalPrice,
      
      // Варіанти з ID
      selectedModelId: selectedModelId,
      selectedModelName: selectedModel ? selectedModel.name : '',
      selectedColorId: selectedColorId,
      selectedColorName: selectedColor ? selectedColor.name : '',
      selectedMaterialId: selectedMaterialId,
      selectedMaterialName: selectedMaterial ? selectedMaterial.name : '',
      selectedProtectionId: selectedProtectionId,
      selectedProtectionName: selectedProtection ? selectedProtection.name : '',
      
      // Кількість
      quantity: quantity,
      
      // Додаткові характеристики
      isVariant: true,
      variantDescription: `${getSelectedModelName()} | ${getSelectedColorName()} | ${getSelectedMaterialName()}`
    };
    
    dispatch(addItemToCart(productToAdd));
    
    alert(`✅ ${product.name} додано до кошика!\nВаріант: ${getSelectedModelName()}, ${getSelectedColorName()}, ${getSelectedMaterialName()}`);
  };

  // Зміна кількості
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  // Зміна варіанту
  const handleVariantChange = (type, value) => {
    switch (type) {
      case 'model':
        setSelectedModelId(value);
        break;
      case 'color':
        setSelectedColorId(value);
        break;
      case 'material':
        setSelectedMaterialId(value);
        break;
      case 'protection':
        setSelectedProtectionId(value);
        break;
      default:
        break;
    }
  };

  if (loading) {
    return <Loader message="Завантаження товару..." />;
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <h2>Товар не знайдено</h2>
        <p>{error || 'Сталася помилка'}</p>
        <Link to="/catalog">Назад до каталогу</Link>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="container">
        {/* Хлібні крихти */}
        <nav className="breadcrumbs">
          <Link to="/">Головна</Link>
          <span> / </span>
          <Link to="/catalog">Каталог</Link>
          <span> / </span>
          <span>{product.name}</span>
        </nav>

        <div className="product-details">
          {/* Зображення */}
          <div className="product-gallery">
            <div className="main-image">
              <img src={product.image} alt={product.name} />
            </div>
            {/* Мініатюри кольорів */}
            <div className="color-thumbnails">
              {VARIANT_OPTIONS.colors.map(color => (
                <button
                  key={color.id}
                  className={`color-thumbnail ${selectedColorId === color.id ? 'active' : ''}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => handleVariantChange('color', color.id)}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Інформація та варіанти */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            {/* Рейтинг */}
            <div className="product-rating">
              <div className="stars">
                {'⭐'.repeat(Math.floor(product.rating || 0))}
                <span className="rating-value">{product.rating || 0}/5</span>
              </div>
            </div>

            {/* Ціна */}
            <div className="product-price">
              <span className="final-price">{finalPrice} ₴</span>
              {finalPrice !== product.price && (
                <span className="base-price">Базова ціна: {product.price} ₴</span>
              )}
            </div>

            {/* Вибір варіантів */}
            <div className="product-variants">
              {/* Модель iPhone */}
              <div className="variant-section">
                <h3>Модель iPhone</h3>
                <div className="variant-options">
                  {VARIANT_OPTIONS.models.map(model => (
                    <label key={model.id} className="variant-option">
                      <input
                        type="radio"
                        name="model"
                        value={model.id}
                        checked={selectedModelId === model.id}
                        onChange={() => handleVariantChange('model', model.id)}
                      />
                      <span className="variant-label">
                        {model.name}
                        {model.priceModifier > 0 && (
                          <span className="price-modifier">+{model.priceModifier} ₴</span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Колір */}
              <div className="variant-section">
                <h3>Колір</h3>
                <div className="color-options">
                  {VARIANT_OPTIONS.colors.map(color => (
                    <button
                      key={color.id}
                      className={`color-option ${selectedColorId === color.id ? 'active' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => handleVariantChange('color', color.id)}
                      title={`${color.name} ${color.priceModifier > 0 ? `(+${color.priceModifier} ₴)` : ''}`}
                    >
                      {color.priceModifier > 0 && (
                        <span className="color-price-modifier">+{color.priceModifier} ₴</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Матеріал */}
              <div className="variant-section">
                <h3>Матеріал</h3>
                <div className="variant-options">
                  {VARIANT_OPTIONS.materials.map(material => (
                    <label key={material.id} className="variant-option">
                      <input
                        type="radio"
                        name="material"
                        value={material.id}
                        checked={selectedMaterialId === material.id}
                        onChange={() => handleVariantChange('material', material.id)}
                      />
                      <span className="variant-label">
                        {material.name}
                        <span className="material-info">{material.weight}</span>
                        {material.priceModifier > 0 && (
                          <span className="price-modifier">+{material.priceModifier} ₴</span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Рівень захисту */}
              <div className="variant-section">
                <h3>Рівень захисту</h3>
                <div className="protection-options">
                  {VARIANT_OPTIONS.protection.map(protection => (
                    <label key={protection.id} className="protection-option">
                      <input
                        type="radio"
                        name="protection"
                        value={protection.id}
                        checked={selectedProtectionId === protection.id}
                        onChange={() => handleVariantChange('protection', protection.id)}
                      />
                      <span className="protection-label">
                        {protection.name}
                        <span className="protection-level">Рівень {protection.level}</span>
                        {protection.priceModifier > 0 && (
                          <span className="price-modifier">+{protection.priceModifier} ₴</span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Кількість */}
            <div className="quantity-section">
              <h3>Кількість</h3>
              <div className="quantity-selector">
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity">{quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 99}
                >
                  +
                </button>
              </div>
            </div>

            {/* Підсумок */}
            <div className="variant-summary">
              <h3>Ваш вибір:</h3>
              <ul>
                <li><strong>Модель:</strong> {getSelectedModelName()}</li>
                <li><strong>Колір:</strong> {getSelectedColorName()}</li>
                <li><strong>Матеріал:</strong> {getSelectedMaterialName()}</li>
                <li><strong>Захист:</strong> {getSelectedProtectionName()}</li>
                <li><strong>Кількість:</strong> {quantity} шт.</li>
              </ul>
              <div className="total-summary">
                <span>Загальна сума:</span>
                <span className="total-price">{finalPrice * quantity} ₴</span>
              </div>
            </div>

            {/* Кнопки дій */}
            <div className="product-actions">
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {product.inStock 
                  ? `Додати в кошик - ${finalPrice * quantity} ₴`
                  : 'Немає в наявності'}
              </button>
              <button 
                className="buy-now-btn"
                disabled={!product.inStock}
                onClick={() => {
                  handleAddToCart();
                  navigate('/cart');
                }}
              >
                Купити зараз
              </button>
            </div>

            {/* Опис та характеристики */}
            <div className="product-description">
              <h3>Опис</h3>
              <p>{product.description}</p>
            </div>

            {product.features && (
              <div className="product-features">
                <h3>Особливості</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Мета-інформація */}
            <div className="product-meta">
              <div className="meta-item">
                <strong>Артикул:</strong> {product.id}
              </div>
              <div className="meta-item">
                <strong>Наявність:</strong>
                <span className={product.inStock ? 'in-stock' : 'out-of-stock'}>
                  {product.inStock ? 'Є в наявності' : 'Немає в наявності'}
                </span>
              </div>
              <div className="meta-item">
                <strong>Гарантія:</strong> 12 місяців
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;