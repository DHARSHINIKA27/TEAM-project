import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ activePage, setActivePage }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'careers', label: 'Careers' },
    { id: 'blogs', label: 'Insights' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setIsOpen(false);
  };

  return (
    <nav className="navbar fluent-glass">
      <div className="navbar-container container">
        {/* Microsoft 4-Square Inspired Brand Logo */}
        <div className="navbar-logo" onClick={() => handleNavClick('home')}>
          <div className="ms-logo-grid">
            <span className="ms-square ms-red-bg" />
            <span className="ms-square ms-green-bg" />
            <span className="ms-square ms-blue-bg" />
            <span className="ms-square ms-yellow-bg" />
          </div>
          <span className="logo-text">Microsoft <span className="logo-sub">Neural IT</span></span>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-links">
          {navLinks.map(link => (
            <button
              key={link.id}
              className={`nav-item ${activePage === link.id ? 'active' : ''}`}
              onClick={() => handleNavClick(link.id)}
            >
              {link.label}
            </button>
          ))}

          {isAuthenticated ? (
            <div className="auth-menu">
              <button
                className={`nav-item auth-btn dashboard-btn ${activePage === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNavClick('dashboard')}
              >
                <LayoutDashboard size={14} />
                <span>Dashboard</span>
              </button>
              <button className="nav-item auth-btn logout-btn" onClick={logout}>
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
              <span className="user-badge">{user?.name}</span>
            </div>
          ) : (
            <button
              className={`nav-item login-link ${activePage === 'login' ? 'active' : ''}`}
              onClick={() => handleNavClick('login')}
            >
              Portal Sign In
            </button>
          )}

          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Mobile Action Controls */}
        <div className="mobile-controls">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="hamburger" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation menu">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="mobile-drawer fluent-glass animate-fade-in">
          {navLinks.map(link => (
            <button
              key={link.id}
              className={`mobile-nav-item ${activePage === link.id ? 'active' : ''}`}
              onClick={() => handleNavClick(link.id)}
            >
              {link.label}
            </button>
          ))}
          
          <div className="mobile-divider" />

          {isAuthenticated ? (
            <div className="mobile-auth-section">
              <div className="mobile-user-info">Operator: <strong>{user?.name}</strong></div>
              <button className="mobile-nav-item mobile-dashboard-btn" onClick={() => handleNavClick('dashboard')}>
                <LayoutDashboard size={16} />
                <span>Admin Dashboard</span>
              </button>
              <button className="mobile-nav-item mobile-logout-btn" onClick={logout}>
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button className="mobile-nav-item mobile-login-btn" onClick={() => handleNavClick('login')}>
              Portal Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
