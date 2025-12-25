import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAuthStore } from './store/authStore.js';
import { router } from './router/router.jsx';
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return <RouterProvider router={router} />;
}

export default App;