import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useItemsStore } from '../store/itemsStore.js';
import { useBidsStore } from '../store/bidsStore.js';
import { useAuthStore } from '../store/authStore.js';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, deleteItem } = useItemsStore();
  const { itemBids, fetchItemBids, createBid, isLoading: bidsLoading } = useBidsStore();
  const { user, isAuthenticated } = useAuthStore();

  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const item = items.find(item => item.id === parseInt(id));
  const bids = itemBids[id] || [];

  useEffect(() => {
    if (id) {
      fetchItemBids(id);
    }
  }, [id, fetchItemBids]);

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

  const getMinBidAmount = () => {
    if (!item) return 0;
    return item.highestBid ? item.highestBid + 100 : item.price + 100;
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidError('');

    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    const amount = parseInt(bidAmount);
    const minAmount = getMinBidAmount();

    if (amount < minAmount) {
      setBidError(`Ставка должна быть не менее ${formatPrice(minAmount)} ₽`);
      return;
    }

    setIsSubmitting(true);

    try {
      await createBid(id, { amount });
      setBidAmount('');
      // Refresh item data
      window.location.reload();
    } catch (error) {
      setBidError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await deleteItem(item.id);
        navigate('/');
      } catch (error) {
        alert('Ошибка удаления: ' + error.message);
      }
    }
  };

  const getInitials = (username) => {
    return username.slice(0, 2).toUpperCase();
  };

  if (!item) {
    return (
      <div className="loading">
        <div>Товар не найден</div>
      </div>
    );
  }

  const isOwner = user && user.id === item.userId;
  const canBid = isAuthenticated && !isOwner;

  return (
    <div>
      <Link to="/" className="back-link">← Вернуться к списку товаров</Link>

      <div className="item-detail">
        <div className="item-header">
          <div>
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="item-image-large"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div 
                className="item-image-large" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '96px',
                  color: '#95a5a6'
                }}
              >
                📦
              </div>
            )}
          </div>

          <div className="item-info">
            <span className="item-status">
              {item.status === 'active' ? 'Активно' : 'Неактивно'}
            </span>
            
            <h1 className="item-title-large">{item.title}</h1>
            
            <div className="item-seller-info">
              <div className="seller-avatar">
                {getInitials(item.username)}
              </div>
              <div className="seller-details">
                <div className="seller-name">{item.username}</div>
                <div className="seller-date">
                  Опубликовано: {formatDate(item.createdAt)}
                </div>
              </div>
            </div>

            <div className="item-description-full">
              {item.description}
            </div>

            <div className="price-section">
              <div className="starting-price">Начальная цена:</div>
              <div className="current-price">{formatPrice(item.price)} ₽</div>
              
              {item.highestBid && (
                <div className="highest-bid">
                  Текущая ставка: {formatPrice(item.highestBid)} ₽
                </div>
              )}

              {canBid && (
                <form className="bid-form" onSubmit={handleBidSubmit}>
                  <input 
                    type="number" 
                    className="bid-input" 
                    placeholder={`Введите вашу ставку (мин. ${formatPrice(getMinBidAmount())} ₽)`}
                    min={getMinBidAmount()}
                    step="100"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                  />
                  {bidError && (
                    <div className="form-error">{bidError}</div>
                  )}
                  <button 
                    type="submit" 
                    className="btn-bid"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Отправка...' : 'Сделать ставку'}
                  </button>
                </form>
              )}

              {!isAuthenticated && (
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <Link to="/signin" className="btn-bid" style={{ textDecoration: 'none' }}>
                    Войдите, чтобы сделать ставку
                  </Link>
                </div>
              )}

              {isOwner && (
                <button 
                  className="btn-delete" 
                  onClick={handleDeleteItem}
                  disabled={item.bidCount > 0}
                  title={item.bidCount > 0 ? 'Нельзя удалить товар с активными ставками' : ''}
                >
                  Удалить товар
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bids-section">
          <div className="bids-header">
            <h2 className="bids-title">История ставок</h2>
            <span className="bids-count">{bids.length}</span>
          </div>

          {bids.length > 0 ? (
            <div className="bids-list">
              {bids.map((bid, index) => (
                <div 
                  key={bid.id} 
                  className={`bid-item ${index === 0 ? 'highest-bid-item' : ''}`}
                >
                  <div className="bid-user">
                    <div className="bid-avatar">
                      {getInitials(bid.username)}
                    </div>
                    <div className="bid-details">
                      <span className="bid-username">{bid.username}</span>
                      <span className="bid-time">{formatDate(bid.createdAt)}</span>
                    </div>
                    {index === 0 && (
                      <span className="highest-badge">🏆 Лидирует</span>
                    )}
                  </div>
                  <div className="bid-amount">{formatPrice(bid.amount)} ₽</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-bids">
              <p>Ставок пока нет. Станьте первым!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;