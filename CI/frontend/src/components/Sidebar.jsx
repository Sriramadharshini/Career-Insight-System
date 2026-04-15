import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CheckSquare, 
  Building2, 
  GraduationCap, 
  Bell, 
  BarChart3, 
  Medal, 
  MessageSquare,
  LogOut 
} from 'lucide-react';
import '../styles/admin.css';
import BrandLogo from './common/BrandLogo';

const navItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', colorClass: 'icon-blue' },
  { path: '/admin/users', icon: Users, label: 'User Management', colorClass: 'icon-green' },
  { path: '/admin/careers', icon: Briefcase, label: 'Career Paths', colorClass: 'icon-purple' },
  { path: '/admin/assessments', icon: CheckSquare, label: 'Assessments', colorClass: 'icon-orange' },
  { path: '/admin/jobs', icon: Building2, label: 'Job Postings', colorClass: 'icon-yellow' },
  { path: '/admin/courses', icon: GraduationCap, label: 'Courses', colorClass: 'icon-cyan' },
  { path: '/admin/notifications', icon: Bell, label: 'Notifications', colorClass: 'icon-red' },
  { path: '/admin/analytics', icon: BarChart3, label: 'Analytics', colorClass: 'icon-pink' },
  { path: '/admin/skills', icon: Medal, label: 'Skills', colorClass: 'icon-teal' },
  { path: '/admin/feedback', icon: MessageSquare, label: 'Feedback', colorClass: 'icon-indigo' },
];

const Sidebar = ({ onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleAdminClick = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  return (
    <div className="admin-sidebar-v2" style={{ height: '100%', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column' }}>      {/* Platform Health Section */}
      <div className="sidebar-status-container">
        <div className="status-label">
          <span>Platform Health</span>
          <span style={{ color: 'var(--accent-blue)' }}>100%</span>
        </div>
        <div className="status-bar-bg">
          <div className="status-bar-fill" style={{ width: '100%' }}></div>
        </div>
      </div>

      {/* Modern Navigation Loop */}
      <nav className="admin-nav-v2" style={{ flex: 1, overflowY: 'auto', marginBottom: 0, paddingBottom: '1rem' }}>
        {navItems.map((item) => {
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
              <div className={`icon-box ${boxClass}`}>
                <Icon size={18} />
              </div>
              <span>{item.label}</span>
              {/* Optional: Add checkmark aesthetic if needed */}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: 'rgba(34, 197, 94, 0.4)' 
                }}></div>
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Admin User Info Footer */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <button 
          onClick={handleAdminClick}
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
