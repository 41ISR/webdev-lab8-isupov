import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';

const Signin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="auth-icon">🔐</div>
        <h1 className="auth-title">Вход</h1>
        <p className="auth-subtitle">Войдите в свой аккаунт</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Имя пользователя</label>
          <input 
            type="text" 
            className="form-input" 
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Введите имя пользователя"
            required
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Пароль</label>
          <input 
            type="password" 
            className="form-input" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль"
            required
            autoComplete="current-password"
          />
        </div>

        <button 
          type="submit" 
          className="btn-submit"
          disabled={isLoading}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>

      <div className="auth-divider">или</div>

      <div className="auth-link">
        Нет аккаунта? <Link to="/signup">Зарегистрироваться</Link>
      </div>
    </div>
  );
};

export default Signin;