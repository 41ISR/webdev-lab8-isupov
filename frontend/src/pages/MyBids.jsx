import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBidsStore } from '../store/bidsStore.js';

const MyBids = () => {
  const { myBids, isLoading, error, fetchMyBids } = useBidsStore();

  useEffect(() => {
    fetchMyBids();
  }, [fetchMyBids]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Менее часа назад';
    if (diffInHours < 24) return `${diffInHours} ч. назад`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} дн. назад`;
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div>Загрузка ставок...</div>
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

  const winningBids = myBids.filter(bid => bid.isWinning);
  const totalAmount = myBids.reduce((sum, bid) => sum + bid.amount, 0);

  return (
    <div>
      <div className="page-header">
        <h1>Мои ставки</h1>
        <p className="page-subtitle">История ваших ставок на товары</p>
      </div>
      <div className="bids-summary">
        <div className="summary-card">
          <span className="summary-value">{myBids.length}</span>
          <span className="summary-label">Всего ставок</span>
        </div>
        <div className="summary-card winning">
          <span className="summary-value">{winningBids.length}</span>
          <span className="summary-label">Лидирующих ставок</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">{formatPrice(totalAmount)} ₽</span>
          <span className="summary-label">Общая сумма</span>
        </div>
      </div>
      
      {myBids.length > 0 ? (
        <div className="bids-list">
          {myBids.map((bid) => (
            <div 
              key={bid.id} 
              className={`bid-item ${bid.isWinning ? 'winning' : ''}`}
            >
              <div 
                className="bid-item-image" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '32px',
                  color: '#95a5a6'
                }}
              >
                📦
              </div>
              
              <div className="bid-item-content">
                <div className="bid-item-header">
                  <Link 
                    to={`/items/${bid.itemId}`} 
                    className="bid-item-title"
                  >
                    {bid.itemTitle}
                  </Link>
                  {bid.isWinning ? (
                    <span className="winning-badge">🏆 Лидирую</span>
                  ) : (
                    <span className="outbid-badge">Перебита</span>
                  )}
                </div>
                <div className="bid-item-meta">
                  <span>⏰ {getTimeAgo(bid.createdAt)}</span>
                </div>
              </div>
              
              <div className="bid-item-amount">
                <span className="bid-amount">{formatPrice(bid.amount)} ₽</span>
                <span className="bid-status">Моя ставка</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-bids">
          <div className="no-bids-icon">💸</div>
          <h2>Вы еще не делали ставок</h2>
          <p>Просмотрите доступные товары и сделайте первую ставку!</p>
          <Link to="/" className="btn-browse">Посмотреть товары</Link>
        </div>
      )}
    </div>
  );
};

export default MyBids;