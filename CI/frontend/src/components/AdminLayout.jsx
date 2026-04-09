import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Menu, User, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import '../styles/admin.css';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <Toaster position="top-right" />
      
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="admin-sidebar-mobile-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="admin-content-wrapper">
        {/* Navbar */}
        <header className="admin-header">
          <div className="admin-header-actions">
            <button 
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="admin-title-box">
              <img src="/src/assets/logo.png" alt="Logo" className="admin-logo" style={{ width: '32px', height: '32px' }} />
              <h1 className="admin-page-title" style={{ fontSize: '1.25rem' }}>Admin Portal</h1>
            </div>
          </div>

          <div className="admin-header-actions">
            <div className="admin-header-profile">
              <User size={16} color="#0A84FF" />
              <span>{user?.name || 'Administrator'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="admin-logout-btn"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="admin-content">
          <div className="admin-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
