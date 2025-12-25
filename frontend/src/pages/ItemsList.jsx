import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useItemsStore } from '../store/itemsStore.js';

const ItemsList = () => {
  const { items, stats, isLoading, error, fetchItems, fetchStats } = useItemsStore();

  useEffect(() => {
    fetchItems();
    fetchStats();
  }, [fetchItems, fetchStats]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div>Загрузка товаров...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        Ошибка загрузки: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Все товары</h1>
      </div>

      {stats && (
        <div className="stats">
          <div className="stat-item">
            <span className="stat-value">{stats.totalItems}</span>
            <span className="stat-label">Товаров</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.totalBids}</span>
            <span className="stat-label">Ставок</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.activeItems}</span>
            <span className="stat-label">Активных</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{formatPrice(stats.averageItemPrice)} ₽</span>
            <span className="stat-label">Средняя цена</span>
          </div>
        </div>
      )}

      {items.length > 0 ? (
        <div className="items-grid">
          {items.map((item) => (
            <Link 
              key={item.id} 
              to={`/items/${item.id}`} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="item-card">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="item-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div 
                    className="item-image" 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '48px',
                      color: '#95a5a6'
                    }}
                  >
                    📦
                  </div>
                )}
                
                <div className="item-content">
                  <span className="status-badge status-active">
                    {item.status === 'active' ? 'Активно' : 'Неактивно'}
                  </span>
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-description">{item.description}</p>
                  
                  <div className="item-footer">
                    <div>
                      <div className="item-price">{formatPrice(item.price)} ₽</div>
                      {item.highestBid && (
                        <div className="bid-info">
                          Текущая ставка: {formatPrice(item.highestBid)} ₽
                          <span className="bid-count">{item.bidCount}</span>
                        </div>
                      )}
                    </div>
                    <div className="item-meta">
                      <span className="item-seller">Продавец: {item.username}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="no-items">
          <div className="no-items-icon">📦</div>
          <h2>Товаров пока нет</h2>
          <p>Станьте первым, кто разместит товар на продажу!</p>
        </div>
      )}
    </div>
  );
};

export default ItemsList;