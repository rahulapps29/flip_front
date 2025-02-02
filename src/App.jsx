// File: src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import UploadPage from './pages/Home';
import SendEmailPage from './pages/SendEmail';
import Dashboard from './pages/Dashboard';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="navbar-wrapper">
          <nav className="navbar">
            <div className="nav-brand">
              <Link to="/upload">My App</Link>
            </div>
            <ul className="nav-links">
              <li><Link to="/upload">Upload CSV</Link></li>
              <li><Link to="/send-email">Send Emails</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </nav>
        </header>

        <main className="content">
          <Routes>
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/send-email" element={<SendEmailPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/upload" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; 
