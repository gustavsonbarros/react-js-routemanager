import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Clientes from '../pages/Clientes';
import Encomendas from '../pages/Encomendas';
import Entregas from '../pages/Entregas';
import Rotas from '../pages/Rotas';
import Rastreamento from '../pages/Rastreamento';
import Login from '../pages/Login';
import ProtectedRoute from '../components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/home', element: <Home /> },
          { path: '/clientes', element: <Clientes /> },
          { path: '/encomendas', element: <Encomendas /> },
          { path: '/entregas', element: <Entregas /> },
          { path: '/rotas', element: <Rotas /> },
          { path: '/rastreamento', element: <Rastreamento /> },
          { path: '/rastreamento/:id', element: <Rastreamento /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/home" replace />,
  },
]);

export default router;