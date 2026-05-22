import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Menu, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import BrandLogo from './common/BrandLogo';
import ModernHomeIcon from './common/ModernHomeIcon';
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
    <div className="admin-layout-root" style={{ background: '#000', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toaster position="top-right" />
      
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 90
          }}
        />
      )}
      
      {/* High-Fidelity Top Navbar */}
      <header className="admin-top-navbar" style={{ 
        height: '74px', 
        background: '#09090b', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button 
            className="admin-mobile-toggle-v2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} color="#fff" />
          </button>
          
          <div 
            onClick={() => navigate('/')} 
            style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            <BrandLogo size={24} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.4rem 1rem 0.4rem 0.5rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'background 0.2s',
            color: '#38bdf8'
          }}
          onClick={() => navigate('/')}
          className="admin-profile-pill"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: 'var(--radius-sm)' }}>
              <ModernHomeIcon size={16} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
              System Admin
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside className={`admin-sidebar-v2 ${isSidebarOpen ? 'open' : ''}`} style={{
          width: '280px',
          background: '#09090b',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          overflowY: 'auto'
        }}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* Main Content Area */}
        <main className="admin-content" style={{ background: '#040405' }}>
          <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};


export default AdminLayout;
