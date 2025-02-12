import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import CustomDialog from './CustomDialog';
import AuthContext from '../src/context/AuthContext';
import "./Navbar.css";



const NavigationBar = () => {
  const { logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true); // Open confirmation dialog
  };

  const confirmLogout = () => {
    setIsLogoutDialogOpen(false); // Close dialog first
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 300); // Delay ensures dialog closes smoothly
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
        <button onClick={handleLogoutClick} className="logout-button" title="Logout">
          <FontAwesomeIcon icon={faPowerOff} />
        </button>
      )}

      {/* Logout Confirmation Dialog */}
      <CustomDialog
        isOpen={isLogoutDialogOpen}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Yes"
        cancelText="No"
        type="warning"
        onConfirm={confirmLogout} // Calls logout function after closing dialog
        onCancel={() => setIsLogoutDialogOpen(false)} // Properly closes dialog
      />
    </nav>
  );
};

export default NavigationBar;
