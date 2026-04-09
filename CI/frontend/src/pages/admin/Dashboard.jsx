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
import dashboardSvg from '../../assets/illustrations/dashboard.svg';
import '../../styles/admin.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, usersData, growth] = await Promise.all([
          adminApi.getDashboardStats(),
          adminApi.getRecentUsers(),
          adminApi.getUserGrowth('weekly')
        ]);
        
        setStats(statsData);
        if (usersData.users) setRecentUsers(usersData.users);
        
        if (growth.labels && growth.data) {
          const formatted = growth.labels.map((date, i) => ({
            date: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
            users: growth.data[i]
          }));
          setGrowthData(formatted);
        }
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
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container page-fade-in">
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <h2 className="admin-page-title">Welcome back, Admin</h2>
            <p className="admin-page-subtitle">Here's what's happening with your system today.</p>
          </div>
          <img src={dashboardSvg} className="admin-illustration" style={{ width: '120px', margin: 0 }} />
        </div>
      </div>

      <div className="admin-stats-grid">
        <StatCard title="Total Users" value={stats?.users || 0} icon={Users} colorClass="var(--accent-blue)" />
        <StatCard title="Career Paths" value={stats?.careers || 0} icon={Briefcase} colorClass="#BF5AF2" />
        <StatCard title="Assessments" value={stats?.assessments || 0} icon={CheckSquare} colorClass="var(--success)" />
        <StatCard title="Job Postings" value={stats?.jobs || 0} icon={Building2} colorClass="var(--accent-gold)" />
        <StatCard title="Active Courses" value={stats?.courses || 0} icon={GraduationCap} colorClass="#5E5CE6" />
        <StatCard title="Feedback" value={stats?.feedback || 0} icon={MessageSquare} colorClass="var(--danger)" />
      </div>

      <div className="admin-dashboard-charts">
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem', marginTop: 0 }}>
            User Growth (Last 7 Days)
          </h3>
          <div style={{ height: '300px', width: '100%' }}>
            {growthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      background: 'rgba(15, 15, 20, 0.95)',
                      border: '1px solid var(--border-soft)', 
                      backdropFilter: 'blur(12px)',
                      color: 'var(--text-main)'
                    }}
                    itemStyle={{ color: 'var(--accent-blue)' }}
                  />
                  <Line type="monotone" dataKey="users" stroke="var(--accent-blue)" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: 'var(--bg-panel)'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <p style={{ color: 'var(--text-muted)' }}>No growth data available yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
              Recent Signups
            </h3>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', background: 'rgba(10, 132, 255, 0.15)', color: 'var(--accent-blue)', borderRadius: '999px' }}>
              {recentUsers.length} New
            </span>
          </div>
          
          <div>
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div key={user._id} className="admin-list-item">
                  <div className="admin-list-user">
                    <div className="admin-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{user.name}</p>
                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', background: 'var(--bg-soft)', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
                    {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>No recent users.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
