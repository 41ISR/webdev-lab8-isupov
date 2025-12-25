import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useItemsStore } from '../store/itemsStore.js';

const CreateItem = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { createItem } = useItemsStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название товара обязательно';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Название не должно превышать 100 символов';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание товара обязательно';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Описание не должно превышать 1000 символов';
    }

    const price = parseInt(formData.price);
    if (!formData.price || price <= 0) {
      newErrors.price = 'Укажите корректную цену';
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Введите корректный URL изображения';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const itemData = {
        ...formData,
        price: parseInt(formData.price),
      };
      
      const newItem = await createItem(itemData);
      navigate(`/items/${newItem.id}`);
    } catch (err) {
      setErrors({ general: err.message || 'Ошибка создания товара' });
    } finally {
      setIsLoading(false);
    }
  };

  const getCharCount = (field) => {
    return formData[field].length;
  };

  const getCharCountClass = (field, maxLength) => {
    const count = getCharCount(field);
    if (count > maxLength * 0.9) return 'error';
    if (count > maxLength * 0.7) return 'warning';
    return '';
  };

  return (
    <div>
      <div className="page-header">
        <h1>Создать новый товар</h1>
      </div>

      <div className="form-container">
        {errors.general && (
          <div className="alert alert-error">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Название товара <span className="required">*</span>
            </label>
            <input 
              type="text" 
              className={`form-input ${errors.title ? 'error' : ''}`}
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Например: iPhone 14 Pro 256GB"
              maxLength="100"
              required
            />
            <div className={`char-counter ${getCharCountClass('title', 100)}`}>
              {getCharCount('title')} / 100
            </div>
            {errors.title && (
              <div className="form-error">{errors.title}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Описание <span className="required">*</span>
            </label>
            <textarea 
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Подробно опишите товар, его состояние, характеристики..."
              maxLength="1000"
              required
            />
            <div className={`char-counter ${getCharCountClass('description', 1000)}`}>
              {getCharCount('description')} / 1000
            </div>
            <div className="form-hint">
              Чем подробнее описание, тем больше шансов продать товар
            </div>
            {errors.description && (
              <div className="form-error">{errors.description}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Начальная цена <span className="required">*</span>
            </label>
            <div className="input-group">
              <input 
                type="number" 
                className={`form-input with-prefix ${errors.price ? 'error' : ''}`}
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="5000"
                min="1"
                step="100"
                required
              />
              <span className="input-prefix">₽</span>
            </div>
            <div className="form-hint">
              Укажите минимальную цену, с которой начнутся торги
            </div>
            {errors.price && (
              <div className="form-error">{errors.price}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              URL изображения
            </label>
            <input 
              type="url" 
              className={`form-input ${errors.imageUrl ? 'error' : ''}`}
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            <div className="form-hint">
              Вставьте ссылку на изображение товара (опционально)
            </div>
            {errors.imageUrl && (
              <div className="form-error">{errors.imageUrl}</div>
            )}
            
            {formData.imageUrl && isValidUrl(formData.imageUrl) && (
              <div className="image-preview active">
                <img 
                  src={formData.imageUrl} 
                  alt="Предпросмотр"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <Link to="/" className="btn-cancel">Отмена</Link>
            <button 
              type="submit" 
              className="btn-submit success"
              disabled={isLoading}
            >
              {isLoading ? 'Создание...' : 'Создать товар'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;