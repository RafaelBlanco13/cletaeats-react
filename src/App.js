import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from './components/Toast';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CrudPage from './pages/CrudPage';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { token } = useAuth();
  return token ? <Navigate to="/" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"        element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/"             element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/clientes"     element={<PrivateRoute><CrudPage section="clientes" /></PrivateRoute>} />
      <Route path="/restaurantes" element={<PrivateRoute><CrudPage section="restaurantes" /></PrivateRoute>} />
      <Route path="/repartidores" element={<PrivateRoute><CrudPage section="repartidores" /></PrivateRoute>} />
      <Route path="/pedidos"      element={<PrivateRoute><CrudPage section="pedidos" /></PrivateRoute>} />
      <Route path="*"             element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer />
      </BrowserRouter>
    </AuthProvider>
  );
}
