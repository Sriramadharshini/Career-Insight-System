import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../services/adminApi';
import { toast } from 'react-hot-toast';
import { generateAnalyticsCSV } from '../../utils/reportGenerator';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar
} from 'recharts';
import { Download, Filter, TrendingUp, Brain, Target, Users, Flame, ArrowUpRight, ArrowDownRight, Minus, Code2, FileSearch } from 'lucide-react';
import '../../styles/admin.css';
import analyticsIllustration from '../../assets/admin-illustrations/analytics.png';

const TREND_COLORS = ['#38bdf8', '#8b5cf6', '#22d3ee', '#fbbf24', '#4ade80', '#f472b6', '#fb923c', '#a78bfa', '#34d399', '#f87171', '#60a5fa', '#e879f9'];

const GrowthBadge = ({ growth }) => {
  if (growth > 0) return (
    <div className="ct-growth-badge ct-growth-up">
      <ArrowUpRight size={12} /> +{growth}%
    </div>
  );
  if (growth < 0) return (
    <div className="ct-growth-badge ct-growth-down">
      <ArrowDownRight size={12} /> {growth}%
    </div>
  );
  return (
    <div className="ct-growth-badge ct-growth-neutral">
      <Minus size={12} /> 0%
    </div>
  );
};

const DemandBadge = ({ level }) => {
  const cls = level === 'High' ? 'ct-demand-high' : level === 'Low' ? 'ct-demand-low' : 'ct-demand-medium';
  return <span className={`ct-demand-badge ${cls}`}>{level}</span>;
};

const Analytics = () => {
  const [period, setPeriod] = useState('monthly');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);

  const fetchData = useCallback(async (selectedPeriod) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getComprehensiveAnalytics(selectedPeriod);
      setData(res);
    } catch (err) {
      console.error("Analytics load error:", err);
      setError("Unable to load analytics data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(period); }, [fetchData, period]);

  const handleExportCSV = async () => {
    if (!data) return;
    setGenerating(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      generateAnalyticsCSV(data, period);
      toast.success("CSV Report exported");
    } catch { toast.error("Failed to export CSV"); }
    finally { setGenerating(false); }
  };

  if (loading && !data) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container page-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '50vh' }}>
        <TrendingUp size={48} style={{ color: '#71717a', marginBottom: '1.5rem', opacity: 0.3 }} />
        <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>{error}</h2>
        <button onClick={() => fetchData(period)} className="admin-button">Retry</button>
      </div>
    );
  }

  const ct = data?.careerTrends;
  const topTech = ct?.topTechnologies || [];
  const domains = ct?.careerDomains || [];
  const recDist = ct?.recommendationDistribution || [];
  const maxTechCount = topTech.length > 0 ? topTech[0].count : 1;
  const ai = data?.aiUsage;

  // Prepare domain data for pie chart
  const domainPieData = domains.map((d, i) => ({ name: d.name, value: d.count, fill: TREND_COLORS[i % TREND_COLORS.length] }));
  const recPieData = recDist.map((r, i) => ({ name: r.name, value: r.value, fill: TREND_COLORS[(i + 5) % TREND_COLORS.length] }));

  return (
    <div className="page-container page-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img src={analyticsIllustration} alt="Analytics Illustration" style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} />
          <div>
            <h2 className="admin-page-title" style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>Analytics Intelligence</h2>
            <p className="admin-page-subtitle" style={{ fontSize: '0.95rem' }}>Real-time user insights, AI performance, and recommendation trends.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="admin-input" style={{ paddingLeft: '2.5rem', appearance: 'none', width: '150px', cursor: 'pointer' }}>
              <option value="today">Today</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <Filter size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
          <button 
            onClick={handleExportCSV} 
            disabled={generating || !data} 
            className="admin-button" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem', 
              background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)', 
              border: 'none', 
              color: '#fff',
              fontWeight: 700,
              padding: '0.6rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
              opacity: generating ? 0.6 : 1,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}
          >
            {generating ? <div className="loading-spinner" style={{ width: 14, height: 14, borderWidth: 2, margin: 0, borderTopColor: '#fff' }}/> : <Download size={18} />}
            Export CSV
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="dashboard-stats-row" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card dash-stat-card">
          <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>AI Recommendations</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: 'var(--radius-sm)' }}><Brain size={24} /></div>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#fafafa' }}>{ai?.total || 0}</p>
          </div>
        </div>
        <div className="admin-card dash-stat-card">
          <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Users</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderRadius: 'var(--radius-sm)' }}><Users size={24} /></div>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#fafafa' }}>{ai?.activeUsers || 0}</p>
          </div>
        </div>
        <div className="admin-card dash-stat-card">
          <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>AI Success Rate</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', borderRadius: 'var(--radius-sm)' }}><Target size={24} /></div>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#4ade80' }}>{ai?.successRate || 0}%</p>
          </div>
        </div>
      </div>

      {/* User Engagement + Feature Usage */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="admin-card dash-chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 className="dash-card-title">Recommendation Engagement</h3>
              <p className="dash-card-subtitle">Day-wise usage distribution of AI recommendation features</p>
            </div>
          </div>
          <div style={{ height: '280px', width: '100%' }}>
            {data?.recommendationEngagement?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.recommendationEngagement}>
                  <defs>
                    <linearGradient id="engagementGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dx={-10} />
                  <Tooltip contentStyle={{ borderRadius: 'var(--radius-md)', background: 'rgba(9,9,11,0.95)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', fontSize: '0.85rem', color: '#fafafa' }} labelStyle={{ fontWeight: 700 }} />
                  <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} fill="url(#engagementGrad)" dot={{ r: 5, fill: '#09090b', strokeWidth: 2.5, stroke: '#8b5cf6' }} activeDot={{ r: 7, fill: '#8b5cf6', strokeWidth: 0 }} name="AI Requests" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
                <TrendingUp size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>No engagement data found</p>
              </div>
            )}
          </div>
        </div>

        <div className="admin-card dash-chart-card">
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 className="dash-card-title">Recommendation Categories</h3>
            <p className="dash-card-subtitle">Distribution of suggested tech domains</p>
          </div>
          <div style={{ height: '200px', width: '100%' }}>
            {recDist.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={recPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                    {recPieData.map((_, i) => (<Cell key={i} fill={TREND_COLORS[(i + 5) % TREND_COLORS.length]} />))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 'var(--radius-sm)', background: 'rgba(9,9,11,0.95)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', fontSize: '0.8rem', color: '#fafafa' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>No distribution data</div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            {recDist.map((item, i) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: TREND_COLORS[(i + 5) % TREND_COLORS.length] }}></div>
                  <span style={{ color: '#a1a1aa' }}>{item.name}</span>
                </div>
                <span style={{ color: '#fafafa', fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Satisfaction & Retention Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="admin-card dash-chart-card">
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 className="dash-card-title">User Satisfaction</h3>
            <p className="dash-card-subtitle">Aggregated feedback sentiment score</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px', position: 'relative' }}>
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{ name: 'Satisfied', value: data?.engagement?.satisfaction || 0 }, { name: 'Other', value: 100 - (data?.engagement?.satisfaction || 0) }]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} startAngle={90} endAngle={450} dataKey="value" stroke="none">
                    <Cell fill="#4ade80" />
                    <Cell fill="rgba(255,255,255,0.05)" />
                  </Pie>
                </PieChart>
             </ResponsiveContainer>
             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fafafa' }}>{data?.engagement?.satisfaction || 0}%</p>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase' }}>Score</p>
             </div>
          </div>
        </div>

        <div className="admin-card dash-chart-card">
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 className="dash-card-title">User Retention</h3>
            <p className="dash-card-subtitle">Active user stickiness over periods</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px', position: 'relative' }}>
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{ name: 'Retained', value: data?.engagement?.retention || 0 }, { name: 'Other', value: 100 - (data?.engagement?.retention || 0) }]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} startAngle={90} endAngle={450} dataKey="value" stroke="none">
                    <Cell fill="#8b5cf6" />
                    <Cell fill="rgba(255,255,255,0.05)" />
                  </Pie>
                </PieChart>
             </ResponsiveContainer>
             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fafafa' }}>{data?.engagement?.retention || 0}%</p>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase' }}>Rate</p>
             </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Analytics Section */}
      <div className="career-trends-section">
        <div className="career-trends-header">
          <div>
            <div className="career-trends-header-left">
              <h3>
                <Flame size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem', color: '#fb923c' }} />
                AI Recommendation Analytics
              </h3>
              <div className="ct-live-pulse">
                <div className="ct-live-dot"></div>
                Live
              </div>
            </div>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#71717a' }}>Deep insights into AI-driven career suggestions and trending technologies</p>
          </div>
          <div className="ct-summary-stats">
            <div className="ct-summary-pill">
              <Users size={14} style={{ color: '#38bdf8' }} />
              Profiles Analyzed: <span className="ct-pill-value">{ct?.totalProfiles || 0}</span>
            </div>
            <div className="ct-summary-pill">
              <FileSearch size={14} style={{ color: '#8b5cf6' }} />
              Resumes Scanned: <span className="ct-pill-value">{ct?.totalResumes || 0}</span>
            </div>
          </div>
        </div>

        {topTech.length > 0 || domains.length > 0 ? (
          <>
            <div className="ct-charts-grid">
              <div className="admin-card dash-chart-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 className="dash-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Code2 size={18} style={{ color: '#38bdf8' }} /> Most Recommended Technologies
                    </h3>
                    <p className="dash-card-subtitle">AI frequency counts for suggested skills</p>
                  </div>
                </div>
                <div style={{ height: Math.max(280, topTech.length * 38), width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topTech.slice(0, 10)} layout="vertical" barSize={16} margin={{ left: 20, right: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="rgba(255,255,255,0.04)" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#e4e4e7', fontSize: 12, fontWeight: 600 }} width={110} />
                      <Tooltip contentStyle={{ borderRadius: 'var(--radius-md)', background: 'rgba(9,9,11,0.95)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', fontSize: '0.82rem', color: '#fafafa' }} />
                      <Bar dataKey="count" radius={[0, 10, 10, 0]}>
                        {topTech.slice(0, 10).map((_, i) => (
                          <Cell key={i} fill={TREND_COLORS[i % TREND_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="admin-card dash-chart-card">
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 className="dash-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target size={18} style={{ color: '#8b5cf6' }} /> Most Suggested Career Paths
                  </h3>
                  <p className="dash-card-subtitle">Distribution of AI-matched career tracks</p>
                </div>
                {domains.length > 0 ? (
                  <>
                    <div style={{ height: '220px', width: '100%' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={domainPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value" stroke="none">
                            {domainPieData.map((entry, i) => (<Cell key={i} fill={entry.fill} />))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: 'var(--radius-sm)', background: 'rgba(9,9,11,0.95)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', fontSize: '0.8rem', color: '#fafafa' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginTop: '0.5rem' }}>
                      {domains.map((d, i) => (
                        <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: TREND_COLORS[i % TREND_COLORS.length] }}></div>
                            <span style={{ color: '#e4e4e7', fontWeight: 500 }}>{d.name}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ color: '#fafafa', fontWeight: 700 }}>{d.count}</span>
                            <GrowthBadge growth={d.growth} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#71717a' }}>No domain data available</div>
                )}
              </div>
            </div>

          </>
        ) : (
          <div className="ct-empty-state">
            <TrendingUp size={44} style={{ color: '#71717a', opacity: 0.3 }} />
            <p>No career trend data available for this period.</p>
          </div>
        )}
      </div>


    </div>
  );
};

export default Analytics;
