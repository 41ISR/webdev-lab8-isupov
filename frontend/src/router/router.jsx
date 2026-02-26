import { createBrowserRouter } from 'react-router-dom';
import Layout from '../pages/layout.jsx';
import ItemsList from '../pages/ItemsList.jsx';
import ItemDetail from '../pages/ItemDetail.jsx';
import CreateItem from '../pages/CreateItem.jsx';
import MyBids from '../pages/MyBids.jsx';
import Signin from '../pages/Signin.jsx';
import Signup from '../pages/Signup.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ItemsList />,
      },
      {
        path: 'items/:id',
        element: <ItemDetail />,
      },
      {
        path: 'create-item',
        element: (
          <ProtectedRoute>
            <CreateItem />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-bids',
        element: (
          <ProtectedRoute>
            <MyBids />
          </ProtectedRoute>
        ),
      },
      {
        path: 'signin',
        element: <Signin />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
    ],
  },
]);