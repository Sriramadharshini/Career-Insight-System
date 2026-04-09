import React from 'react';
import { NavLink } from 'react-router-dom';
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
  X 
} from 'lucide-react';
import '../styles/admin.css';

const navItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/users', icon: Users, label: 'User Management' },
  { path: '/admin/careers', icon: Briefcase, label: 'Career Paths' },
  { path: '/admin/assessments', icon: CheckSquare, label: 'Assessments' },
  { path: '/admin/jobs', icon: Building2, label: 'Job Postings' },
  { path: '/admin/courses', icon: GraduationCap, label: 'Courses' },
  { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
  { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/admin/skills', icon: Medal, label: 'Skills' },
  { path: '/admin/feedback', icon: MessageSquare, label: 'Feedback' },
];

const Sidebar = ({ onClose }) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="admin-sidebar-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="admin-title-box">
            <img src="/src/assets/logo.png" alt="Logo" className="admin-logo" />
            <div>
              <h2 className="admin-title">Career Insight</h2>
              <span className="admin-sidebar-subtitle">Admin Portal</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="admin-mobile-toggle"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <nav className="admin-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-soft)' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0.75rem', 
          borderRadius: '12px', 
          background: 'var(--bg-soft)',
          border: '1px solid var(--border-soft)'
        }}>
          <div className="admin-avatar">
            A
          </div>
          <div style={{ marginLeft: '0.75rem' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Administrator</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>System Controller</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
