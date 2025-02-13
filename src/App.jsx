import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import UploadPage from './pages/Home';
import SendEmailPage from './pages/SendEmail';
import Dashboard from './pages/Dashboard';
import FormPage from './pages/FormPage';
import Login from './pages/Login';
import Instructions from "./pages/Instructions";
import NotFoundPage from "./pages/NotFoundPage"; // Custom 404 Page
import AuthContext, { AuthProvider } from './context/AuthContext';
import NavigationBar from '../ui/Navbar';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const App = () => {
  const location = useLocation();
  const hideNavBar = location.pathname === '/form' || location.pathname === '/login' || location.pathname === '/404';

  return (
    <div>
      {!hideNavBar && <NavigationBar />}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/instructions" element={<ProtectedRoute><Instructions /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path="/send-email" element={<ProtectedRoute><SendEmailPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* 🚀 Catch All Invalid Routes and Redirect to 404 */}
        <Route path="*" element={<Navigate to="/404" />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <AuthProvider>
    <Router>
      <App />
    </Router>
  </AuthProvider>
);

export default AppWrapper;
