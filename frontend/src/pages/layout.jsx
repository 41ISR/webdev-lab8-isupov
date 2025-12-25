import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';

const Layout = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div>
      <header>
        <nav>
          <Link to="/" className="logo">🛒 Маркетплейс</Link>
          
          {isAuthenticated ? (
            <ul className="nav-links">
              <li>
                <Link 
                  to="/" 
                  className={isActive('/') ? 'active' : ''}
                >
                  Товары
                </Link>
              </li>
              <li>
                <Link 
                  to="/my-bids" 
                  className={isActive('/my-bids') ? 'active' : ''}
                >
                  Мои ставки
                </Link>
              </li>
              <li>
                <Link 
                  to="/create-item" 
                  className="btn-primary"
                >
                  + Создать товар
                </Link>
              </li>
              <li className="user-info">
                <span className="username">{user?.username}</span>
                <button className="btn-logout" onClick={handleLogout}>
                  Выйти
                </button>
              </li>
            </ul>
          ) : (
            <ul className="nav-links">
              <li>
                <Link to="/">Товары</Link>
              </li>
              <li>
                <Link to="/signin">Войти</Link>
              </li>
              <li>
                <Link to="/signup" className="btn-primary">
                  Регистрация
                </Link>
              </li>
            </ul>
          )}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>&copy; 2025 Маркетплейс. Все права защищены.</p>
      </footer>
    </div>
  );
};

export default Layout;