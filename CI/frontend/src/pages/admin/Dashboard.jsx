import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import { toast } from 'react-hot-toast';
import { Users, Brain, Zap, Star, TrendingUp, Clock, Server, FileText, MessageSquare, Briefcase } from 'lucide-react';
import '../../styles/admin.css';
import { formatDistanceToNow } from 'date-fns';

import dashboardIllustration from '../../assets/admin-illustrations/dashboard.png';

const getActivityIcon = (type) => {
  const iconMap = {
    user: { icon: Users, color: '#4ade80', bg: 'rgba(74, 222, 128, 0.1)' },
    ai: { icon: Brain, color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.1)' },
    feedback: { icon: Star, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' },
    career: { icon: TrendingUp, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    interview: { icon: Zap, color: '#f472b6', bg: 'rgba(244, 114, 182, 0.1)' },
    system: { icon: Server, color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)' },
    resume: { icon: FileText, color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)' },
    community: { icon: MessageSquare, color: '#fdba74', bg: 'rgba(253, 186, 116, 0.1)' },
    job: { icon: Briefcase, color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)' },
  };
  return iconMap[type] || iconMap.system;
};

const DashStatCard = ({ title, value, icon: Icon, color, trend, trendUp }) => (
  <div className="admin-card dash-stat-card">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `color-mix(in srgb, ${color} 12%, transparent)`, color: color, border: `1px solid color-mix(in srgb, ${color} 20%, transparent)` }}>
        <Icon size={20} />
      </div>
      {trend && (
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: trendUp ? '#4ade80' : '#f87171', background: trendUp ? 'rgba(74, 222, 128, 0.08)' : 'rgba(248, 113, 113, 0.08)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${trendUp ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)'}` }}>
          {trendUp ? '↑' : '↓'} {trend}
        </span>
      )}
    </div>
    <p style={{ margin: 0, fontSize: '1.65rem', fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em' }}>{value}</p>
    <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{title}</p>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState({ stats: null, recentActivity: [] });
  const [loggedInUsers, setLoggedInUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, activityData, loggedInUsersData] = await Promise.all([
          adminApi.getDashboardStats(),
          adminApi.getRecentActivity(),
          adminApi.getLoggedInUsers()
        ]);
        setData({ stats: statsData, recentActivity: activityData.activity || [] });
        setLoggedInUsers(loggedInUsersData.users || []);
      } catch (error) {
        console.error("Dashboard error:", error);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container page-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <img src={dashboardIllustration} alt="Dashboard Illustration" style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} />
            <div>
              <h2 className="admin-page-title" style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>Dashboard</h2>
              <p className="admin-page-subtitle" style={{ fontSize: '0.95rem' }}>Platform overview, recent activity, and system status.</p>
            </div>
          </div>
          <div className="dashboard-live-badge">
            <div className="live-dot" style={{ borderRadius: 'var(--radius-xl)' }}></div>
            <div className="live-dot-ping" style={{ borderRadius: 'var(--radius-xl)' }}></div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4ade80' }}>LIVE</span>
          </div>
        </div>
      </div>

      <div className="dashboard-stats-row">
        <DashStatCard title="Active Users" value={data.stats?.users || 0} icon={Users} color="#38bdf8" trend="Live" trendUp={true} />
        <DashStatCard title="AI Requests Today" value={data.stats?.aiRequestsToday || 0} icon={Brain} color="#8b5cf6" trend="Today" trendUp={true} />
        <DashStatCard title="Mock Interviews" value={data.stats?.mockInterviews || 0} icon={Zap} color="#22d3ee" trend="Total" trendUp={true} />
        <DashStatCard title="Feedback Count" value={data.stats?.feedbackCount || 0} icon={Star} color="#fbbf24" trend="Total" trendUp={true} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        {/* Recent Activity */}
        <div className="admin-card dash-chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="dash-card-title">Recent Activity</h3>
            <span className="dash-badge" style={{ background: 'rgba(74, 222, 128, 0.08)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.15)' }}>LIVE FEED</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {data.recentActivity?.length > 0 ? data.recentActivity.slice(0, 8).map((item) => {
              const activityMeta = getActivityIcon(item.type);
              const IconComp = activityMeta.icon;
              return (
                <div key={item._id} className="dash-activity-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: activityMeta.bg, color: activityMeta.color, flexShrink: 0 }}>
                      <IconComp size={16} />
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#e4e4e7', fontWeight: 500 }}>
                      {item.user?.name || 'User'} {item.action.toLowerCase()} {item.target === 'Platform' ? '' : item.target.toLowerCase()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={12} style={{ color: '#52525b' }} />
                    <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 500 }}>
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              );
            }) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>No recent activity.</div>
            )}
          </div>
        </div>

        {/* Logged-in Users */}
        <div className="admin-card dash-chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="dash-card-title">Logged-in Users</h3>
            <span className="dash-badge" style={{ background: 'rgba(56, 189, 248, 0.08)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.15)' }}>ACTIVE USERS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {loggedInUsers.length > 0 ? loggedInUsers.map((user) => (
              <div key={user._id} className="dash-activity-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', flexShrink: 0, fontWeight: 700, fontSize: '0.9rem' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#e4e4e7', fontWeight: 600, display: 'block' }}>
                      {user.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 500, display: 'block' }}>
                      {user.email}
                    </span>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: user.status === 'Active' ? '#4ade80' : '#f87171', background: user.status === 'Active' ? 'rgba(74, 222, 128, 0.08)' : 'rgba(248, 113, 113, 0.08)', border: `1px solid ${user.status === 'Active' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)'}`, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                    {user.status}
                  </span>
                </div>
              </div>
            )) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>No logged-in users.</div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
