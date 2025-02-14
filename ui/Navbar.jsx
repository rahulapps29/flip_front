import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import CustomDialog from "./CustomDialog";
import AuthContext from "../src/context/AuthContext";
import "./Navbar.css";

const NavigationBar = () => {
  const { logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true); // Open confirmation dialog
  };

  const confirmLogout = () => {
    setIsLogoutDialogOpen(false); // Close dialog first
    setTimeout(() => {
      logout();
      navigate("/login");
    }, 300); // Delay ensures dialog closes smoothly
  };

  // Navigation Items
  const navItems = [
    { path: "/upload", label: "Upload CSV" },
    { path: "/send-email", label: "Send Emails" },
    { path: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="fancy-nav-bar">
      <ul className="fancy-nav-list">
        {navItems.map((item) => (
          <li key={item.path} className="fancy-nav-item">
            {location.pathname === item.path ? (
              // Disable the button for the current page
              <span className="fancy-nav-link disabled-link">{item.label}</span>
            ) : (
              <Link to={item.path} className="fancy-nav-link">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {isAuthenticated && (
        <button
          onClick={handleLogoutClick}
          className="logout-button"
          title="Logout"
        >
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
