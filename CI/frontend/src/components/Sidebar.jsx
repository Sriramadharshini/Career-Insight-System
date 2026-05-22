import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BarChart3, 
  Brain, 
  MessageSquare,
  Settings,
  LogOut,
  Users
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import '../styles/admin.css';

const sidebarSections = [
  {
    title: 'OVERVIEW',
    items: [
      { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', colorClass: 'icon-blue' },
      { path: '/admin/analytics', icon: BarChart3, label: 'Analytics', colorClass: 'icon-purple' },
      { path: '/admin/ai-insights', icon: Brain, label: 'AI Insights', colorClass: 'icon-cyan' },
    ]
  },
  {
    title: 'MANAGE',
    items: [
      { path: '/admin/community', icon: Users, label: 'Community', colorClass: 'icon-green' },
      { path: '/admin/feedback', icon: MessageSquare, label: 'Feedback', colorClass: 'icon-indigo' },
      { path: '/admin/settings', icon: Settings, label: 'Settings', colorClass: 'icon-gray' },
    ]
  }
];

const Sidebar = ({ onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const getFilteredSections = () => {
    return sidebarSections.map(section => {
      if (section.title === 'MANAGE') {
        return {
          ...section,
          items: section.items.filter(item => {
            if (item.label === 'Community' && settings?.communityAccess === false) return false;
            if (item.label === 'Feedback' && settings?.feedbackEnabled === false) return false;
            return true;
          })
        };
      }
      return section;
    });
  };

  const filteredSections = getFilteredSections();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  return (
    <div className="admin-sidebar-v2" style={{ height: '100%', paddingTop: '1rem', display: 'flex', flexDirection: 'column' }}>
      {/* Platform Health Bar */}
      <div className="sidebar-status-container">
        <div className="status-label">
          <span>Platform Status</span>
          <span style={{ color: '#32D74B' }}>● Online</span>
        </div>
        <div className="status-bar-bg">
          <div className="status-bar-fill" style={{ width: '100%' }}></div>
        </div>
      </div>

      {/* Section-Based Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', paddingBottom: '1rem' }}>
        {filteredSections.map((section) => (
          <div key={section.title} style={{ marginBottom: '0.5rem' }}>
            <div className="sidebar-section-title">{section.title}</div>
            <div className="admin-nav-v2">
              {section.items.map((item) => {
                const Icon = item.icon;
                const boxClass = item.colorClass.replace('icon-', 'box-');
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `nav-item-v2 ${isActive ? 'active' : ''}`
                    }
                  >
                    <div className="nav-active-indicator"></div>
                    <div className={`icon-box ${boxClass}`}>
                      <Icon size={18} />
                    </div>
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout Footer */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <button 
          onClick={handleLogout}
          className="nav-item-v2"
          style={{ width: '100%', background: 'transparent', border: '1px solid transparent', cursor: 'pointer', padding: '0.75rem' }}
        >
          <div className="icon-box box-red">
            <LogOut size={18} />
          </div>
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Admin System</span>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>Click to Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
