import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import UploadPage from './pages/Home';
import SendEmailPage from './pages/SendEmail';
import Dashboard from './pages/Dashboard';
import FormPage from './pages/FormPage';
import Login from './pages/Login';
import Instructions from "./pages/Instructions";
import AuthContext, { AuthProvider } from './context/AuthContext';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// ✅ Navigation Bar with Icon for Logout
const NavigationBar = () => {
  const { logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fancy-nav-bar">
      <ul className="fancy-nav-list">
        <li className="fancy-nav-item">
          <Link to="/upload" className="fancy-nav-link">Upload CSV</Link>
        </li>
        <li className="fancy-nav-item">
          <Link to="/send-email" className="fancy-nav-link">Send Emails</Link>
        </li>
        <li className="fancy-nav-item">
          <Link to="/dashboard" className="fancy-nav-link">Dashboard</Link>
        </li>
      </ul>

      {isAuthenticated && (
        <button onClick={handleLogout} className="logout-button" title="Logout"> 
          <FontAwesomeIcon icon={faPowerOff} />
        </button>
      )}
    </nav>
  );
};

const App = () => {
  const location = useLocation();
  const hideNavBar = location.pathname === '/form' || location.pathname === '/login';

  return (
    <div>
      {!hideNavBar && <NavigationBar />}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path="/send-email" element={<ProtectedRoute><SendEmailPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
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
