import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../services/adminApi';
import { toast } from 'react-hot-toast';
import { AnalyticsHeroIllustration, EmptyStateIllustration } from '../../components/admin/AdminIllustrations';
import SearchBar from '../../components/common/SearchBar';
import '../../styles/admin.css';

const Analytics = () => {
  const [data, setData] = useState({ careers: [], jobs: [], courses: [], feedback: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Individual fetchers to ensure partial data still loads
    const fetchMetric = async (type, fallback = []) => {
      try {
        return await adminApi.getAnalytics(type);
      } catch (err) {
        console.warn(`Failed to load ${type} analytics:`, err);
        return fallback;
      }
    };

    try {
      const [careers, jobs, feedback] = await Promise.all([
        fetchMetric('careers', { labels: [], data: [] }),
        fetchMetric('jobs', { labels: [], data: [] }),
        fetchMetric('feedback', { total: 0, average: 0, distribution: {} })
      ]);
      
      setData({ 
        careers, 
        jobs, 
        courses: [], 
        feedback: feedback || { total: 0, average: 0, distribution: {} }
      });
    } catch (err) {
      console.error("Critical analytics load error:", err);
      setError("Unable to initialize intelligence engine");
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleSearch = (query) => {
    console.log("Analytics search:", query);
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container page-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ width: '280px', marginBottom: '2rem' }}>
          <AnalyticsHeroIllustration />
        </div>
        <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>{error}</h2>
        <button onClick={fetchAll} className="admin-button">Retry Loading Intelligence</button>
      </div>
    );
  }

  return (
    <div className="page-container page-fade-in">
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <h2 className="admin-page-title">Platform Intelligence</h2>
            <p className="admin-page-subtitle">Historical trends and real-time system performance data.</p>
          </div>
          <div style={{ width: '200px' }}>
            <AnalyticsHeroIllustration />
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-search-container">
          <SearchBar onSearch={handleSearch} placeholder="Filter analytics view..." />
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Careers Distribution */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem' }}>Careers by Industry</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.careers?.labels?.map((label, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span className="admin-status-badge admin-status-active">{data.careers.data[i]}</span>
              </li>
            ))}
            {(!data.careers?.labels || data.careers.labels.length === 0) && (
              <div style={{ padding: '2rem 0' }}>
                <EmptyStateIllustration color="purple" />
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.85rem' }}>No industry data available</p>
              </div>
            )}
          </ul>
        </div>

        {/* Jobs Profile */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem' }}>Market Opportunity</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.jobs?.labels?.map((label, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span className="admin-status-badge" style={{ background: 'rgba(255, 159, 10, 0.15)', color: 'var(--accent-gold)' }}>{data.jobs.data[i]}</span>
              </li>
            ))}
            {(!data.jobs?.labels || data.jobs.labels.length === 0) && (
              <div style={{ padding: '2rem 0' }}>
                <EmptyStateIllustration color="orange" />
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.85rem' }}>No market data available</p>
              </div>
            )}
          </ul>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem' }}>Engagement Metrics</h3>
        <div className="admin-stats-grid">
          <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.1)', padding: '1.5rem', borderRadius: '16px' }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>{data.feedback?.total || 0}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>Total Engagements</p>
          </div>
          <div style={{ background: 'rgba(251, 191, 36, 0.05)', border: '1px solid rgba(251, 191, 36, 0.1)', padding: '1.5rem', borderRadius: '16px' }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-gold)', margin: '0 0 0.5rem 0' }}>{data.feedback?.average || 0} / 5</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>Satisfaction Score</p>
          </div>
          <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.1)', padding: '1.5rem', borderRadius: '16px' }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6', margin: '0 0 0.5rem 0' }}>
              {data.feedback?.distribution?.['5'] || 0} 
            </p>
            <p style={{ fontSize: '0.85rem', color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>Elite Ratings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
