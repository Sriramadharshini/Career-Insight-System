import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import { toast } from 'react-hot-toast';
import StatCard from '../../components/common/StatCard';
import { 
  Users, CheckSquare, Building2, GraduationCap, 
  MessageSquare, Briefcase 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { DashboardHeroIllustration, EmptyStateIllustration } from '../../components/admin/AdminIllustrations';
import '../../styles/admin.css';


const Dashboard = () => {
  const [data, setData] = useState({
    stats: null,
    recentUsers: [],
    recentActivity: [],
    growthData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, usersData, activityData, growth] = await Promise.all([
          adminApi.getDashboardStats(),
          adminApi.getRecentUsers(),
          adminApi.getRecentActivity(),
          adminApi.getUserGrowth('weekly')
        ]);
        
        let formattedGrowth = [];
        if (growth.labels && growth.data) {
          formattedGrowth = growth.labels.map((date, i) => ({
            date: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
            users: growth.data[i]
          }));
        }

        setData({
          stats: statsData,
          recentUsers: usersData.users || [],
          recentActivity: activityData.activity || [],
          growthData: formattedGrowth
        });
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
      <div className="admin-page-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <h2 className="admin-page-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Platform Overview</h2>
            <p className="admin-page-subtitle" style={{ fontSize: '1rem' }}>Unified management center for user growth, career metrics, and system activity.</p>
          </div>
          <div style={{ width: '220px' }}>
            <DashboardHeroIllustration />
          </div>
        </div>
        <div className="admin-card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '16px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#32D74B' }}></div>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '12px', height: '12px', borderRadius: '50%', background: '#32D74B', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1 }}>System Healthy</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>All services operational</span>
          </div>
        </div>
      </div>

      {/* Summary Matrix */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <StatCard title="Total Platform Users" value={data.stats?.users || 0} icon={Users} colorClass="var(--accent-blue)" />
        <StatCard title="Active Career Tracks" value={data.stats?.careers || 0} icon={Briefcase} colorClass="#BF5AF2" />
        <StatCard title="Verified Assessments" value={data.stats?.assessments || 0} icon={CheckSquare} colorClass="var(--success)" />
        <StatCard title="Industry Opportunities" value={data.stats?.jobs || 0} icon={Building2} colorClass="var(--accent-gold)" />
      </div>

      {/* Main Analytics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        {/* Growth Analytics */}
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.3px' }}>User Acquisition Trend</h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daily growth metrics for the last 7 days</p>
            </div>
            <div style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, border: '1px solid var(--border-soft)' }}>
              WEEKLY VIEW
            </div>
          </div>
          <div style={{ height: '350px', width: '100%', marginTop: 'auto' }}>
            {data.growthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.growthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 13, fontWeight: 500}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 13}} dx={-15} />
                  <Tooltip 
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      background: 'rgba(15, 15, 20, 0.98)',
                      border: '1px solid var(--border-soft)', 
                      backdropFilter: 'blur(20px)',
                      padding: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="var(--accent-blue)" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#050816', strokeWidth: 3, stroke: 'var(--accent-blue)' }} 
                    activeDot={{ r: 9, fill: 'var(--accent-blue)', strokeWidth: 0 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)', gap: '1rem' }}>
                <div style={{ opacity: 0.3 }}><DashboardHeroIllustration /></div>
                <p style={{ fontWeight: 500 }}>System is gathering acquisition data...</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Newcomers */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Recent Members</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 700, cursor: 'pointer' }}>View All</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.recentUsers.map((user) => (
              <div key={user._id} className="admin-list-item" style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-soft)' }}>
                <div className="admin-list-user" style={{ gap: '1rem' }}>
                  <div className="admin-avatar" style={{ width: '42px', height: '42px', fontSize: '0.95rem', background: 'var(--bg-soft)', border: '1px solid var(--border-soft)' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{user.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                    {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Bar */}
      <div style={{ marginTop: '1.5rem' }}>
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Global Activity Stream</h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time updates from platform interactions</p>
            </div>
            <button className="admin-button" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Export Log</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1rem' }}>
            {data.recentActivity.length > 0 ? (
              data.recentActivity.map((activity) => (
                <div key={activity._id} style={{ display: 'flex', gap: '1.25rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-soft)', alignItems: 'center' }}>
                  <div className="admin-avatar" style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, var(--bg-soft), rgba(255,255,255,0.02))', color: 'var(--accent-blue)', fontSize: '0.85rem', fontWeight: 800, border: '1px solid var(--border-soft)' }}>
                    {activity.user?.name?.charAt(0) || 'S'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                      <strong style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>{activity.user?.name || 'System'}</strong> {activity.action} <span style={{ color: 'var(--accent-teal)', fontWeight: 600 }}>{activity.target}</span>
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-blue)' }}></span>
                      {new Date(activity.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '4rem 0', textAlign: 'center' }}>
                <EmptyStateIllustration color="blue" />
                <p style={{ color: 'var(--text-muted)', marginTop: '2rem', fontWeight: 600, fontSize: '1.1rem' }}>Initializing activity stream...</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};


export default Dashboard;
