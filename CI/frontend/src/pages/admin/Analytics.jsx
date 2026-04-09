import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { toast } from 'react-hot-toast';
import analyticsSvg from '../../assets/illustrations/analytics.svg';
import '../../styles/admin.css';

const Analytics = () => {
  const [data, setData] = useState({ careers: [], jobs: [], courses: [], feedback: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [c, j, crs, f] = await Promise.all([
          adminApi.getAnalytics('careers'),
          adminApi.getAnalytics('jobs'),
          adminApi.getAnalytics('courses'),
          adminApi.getAnalytics('feedback')
        ]);
        setData({ careers: c, jobs: j, courses: crs, feedback: f });
      } catch (err) {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
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
            <h2 className="admin-page-title">Platform Analytics</h2>
            <p className="admin-page-subtitle">View system-wide statistics and metrics.</p>
          </div>
          <img src={analyticsSvg} className="admin-illustration" style={{ width: '120px', margin: 0 }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Careers Distribution */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem' }}>Careers by Industry</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.careers.labels?.map((label, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span className="admin-status-badge admin-status-active">{data.careers.data[i]}</span>
              </li>
            ))}
            {(!data.careers.labels || data.careers.labels.length === 0) && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No data available</p>
            )}
          </ul>
        </div>

        {/* Jobs Profile */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem' }}>Job Types Distribution</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.jobs.labels?.map((label, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span className="admin-status-badge" style={{ background: 'rgba(255, 159, 10, 0.15)', color: 'var(--accent-gold)' }}>{data.jobs.data[i]}</span>
              </li>
            ))}
            {(!data.jobs.labels || data.jobs.labels.length === 0) && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No data available</p>
            )}
          </ul>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem' }}>Feedback Breakdown</h3>
        <div className="admin-stats-grid">
          <div style={{ background: 'var(--bg-soft)', border: '1px solid var(--border-soft)', padding: '1.5rem', borderRadius: '12px' }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>{data.feedback?.total || 0}</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>Total Reviews</p>
          </div>
          <div style={{ background: 'rgba(255, 159, 10, 0.1)', border: '1px solid rgba(255, 159, 10, 0.2)', padding: '1.5rem', borderRadius: '12px' }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-gold)', margin: '0 0 0.5rem 0' }}>{data.feedback?.average || 0} / 5</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', margin: 0 }}>Average Rating</p>
          </div>
          <div style={{ background: 'rgba(10, 132, 255, 0.1)', border: '1px solid rgba(10, 132, 255, 0.2)', padding: '1.5rem', borderRadius: '12px' }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-blue)', margin: '0 0 0.5rem 0' }}>
              {data.feedback?.distribution?.['5'] || 0} 
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--accent-blue)', margin: 0 }}>5-Star Ratings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
