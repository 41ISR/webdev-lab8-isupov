import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register, isAuthenticated } = useAuthStore();
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
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.username.length < 3) {
      newErrors.username = 'Имя пользователя должно быть не менее 3 символов';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/', { replace: true });
    } catch (err) {
      setErrors({ general: err.message || 'Ошибка регистрации' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="auth-icon">👤</div>
        <h1 className="auth-title">Регистрация</h1>
        <p className="auth-subtitle">Создайте новый аккаунт</p>
      </div>

      {errors.general && (
        <div className="alert alert-error">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Имя пользователя</label>
          <input 
            type="text" 
            className={`form-input ${errors.username ? 'error' : ''}`}
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Введите имя пользователя"
            minLength="3"
            required
            autoComplete="username"
          />
          <div className="form-hint">Минимум 3 символа</div>
          {errors.username && (
            <div className="form-error">{errors.username}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Email <span style={{ color: '#95a5a6', fontWeight: 400 }}>(необязательно)</span>
          </label>
          <input 
            type="email" 
            className={`form-input ${errors.email ? 'error' : ''}`}
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            autoComplete="email"
          />
          {errors.email && (
            <div className="form-error">{errors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Пароль</label>
          <input 
            type="password" 
            className={`form-input ${errors.password ? 'error' : ''}`}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль"
            minLength="6"
            required
            autoComplete="new-password"
          />
          <div className="form-hint">Минимум 6 символов</div>
          {errors.password && (
            <div className="form-error">{errors.password}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Подтверждение пароля</label>
          <input 
            type="password" 
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Повторите пароль"
            required
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <div className="form-error">{errors.confirmPassword}</div>
          )}
        </div>

        <button 
          type="submit" 
          className="btn-submit success"
          disabled={isLoading}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>

      <div className="auth-divider">или</div>

      <div className="auth-link">
        Уже есть аккаунт? <Link to="/signin">Войти</Link>
      </div>
    </div>
  );
};

export default Signup;