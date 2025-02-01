// File: src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UploadPage from './pages/Home';
import SendEmailPage from './pages/SendEmail';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <Router>
      <div>
        <nav className="bg-gray-800 p-4 text-white">
          <ul className="flex gap-4">
            <li><Link to="/upload">Upload CSV</Link></li>
            <li><Link to="/send-email">Send Emails</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/send-email" element={<SendEmailPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;