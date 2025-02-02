// File: src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import UploadPage from './pages/Home';
import SendEmailPage from './pages/SendEmail';
import Dashboard from './pages/Dashboard';
import FormPage from './pages/FormPage';
import './App.css';

const NavigationBar = () => (
  <nav className="fancy-nav-bar">
    <ul className="fancy-nav-list">
      <li className="fancy-nav-item"><Link to="/upload" className="fancy-nav-link">Upload CSV</Link></li>
      <li className="fancy-nav-item"><Link to="/send-email" className="fancy-nav-link">Send Emails</Link></li>
      <li className="fancy-nav-item"><Link to="/dashboard" className="fancy-nav-link">Dashboard</Link></li>
    </ul>
  </nav>
);

const App = () => {
  const location = useLocation();

  // Condition to hide nav bar on the FormPage
  const hideNavBar = location.pathname === '/form';

  return (
    <div>
      {!hideNavBar && <NavigationBar />}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/send-email" element={<SendEmailPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/form" element={<FormPage />} />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
