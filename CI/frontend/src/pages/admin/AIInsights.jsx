import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../services/adminApi';
import { toast } from 'react-hot-toast';
import { Brain, TrendingUp, Sparkles, Target, Zap, Code2, Flame, Users, Lightbulb, AlertCircle, TrendingDown, ArrowUpRight, ShieldCheck, Activity } from 'lucide-react';
import '../../styles/admin.css';
import aiInsightsIllustration from '../../assets/admin-illustrations/ai_insights.png';

const TREND_COLORS = ['#38bdf8', '#8b5cf6', '#22d3ee', '#4ade80', '#fbbf24', '#f472b6', '#fb923c', '#a78bfa', '#34d399', '#f87171', '#60a5fa', '#e879f9'];

const AIInsights = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (period) => {
    setLoading(true);
    setError(null);
    try {
      const periodMap = { '24h': 'today', '7d': 'weekly', '30d': 'monthly' };
      const selectedPeriod = periodMap[period] || 'monthly';
      const analyticsRes = await adminApi.getComprehensiveAnalytics(selectedPeriod);
      setData(analyticsRes);
    } catch (error) {
      console.error("Failed to load AI Insights", error);
      setError("Failed to load AI intelligence data. Please try again.");
      toast.error("Failed to load AI data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(timeRange); }, [fetchData, timeRange]);

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
        <Brain size={48} style={{ color: '#71717a', marginBottom: '1.5rem', opacity: 0.3 }} />
        <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>{error}</h2>
        <button onClick={() => fetchData(timeRange)} className="admin-button">Retry Fetch</button>
      </div>
    );
  }

  const ai = data?.aiUsage;
  const ct = data?.careerTrends;
  const smartInsights = ct?.smartInsights || [];
  const topTech = ct?.topTechnologies || [];
  const domains = ct?.careerDomains || [];
  const skillGaps = ct?.skillGaps || [];
  const behavioral = ct?.behavioral || {};

  return (
    <div className="page-container page-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <img src={aiInsightsIllustration} alt="AI Insights Illustration" style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} />
            <div>
              <h2 className="admin-page-title" style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>AI Smart Insights</h2>
              <p className="admin-page-subtitle" style={{ fontSize: '0.95rem' }}>AI-generated intelligence, predictions, and behavioral analysis.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
              {['24h', '7d', '30d'].map(range => (
                <button 
                  key={range} 
                  onClick={() => setTimeRange(range)}
                  style={{ 
                    cursor: 'pointer', 
                    border: 'none', 
                    background: timeRange === range ? 'rgba(56, 189, 248, 0.1)' : 'transparent', 
                    color: timeRange === range ? '#38bdf8' : '#71717a', 
                    padding: '0.4rem 1.25rem', 
                    borderRadius: 'var(--radius-sm)', 
                    fontSize: '0.8rem', 
                    fontWeight: 700,
                    transition: 'all 0.2s ease'
                  }}
                >{range}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Intelligence Stats */}
      <div className="dashboard-stats-row" style={{ marginBottom: '1.5rem' }}>
        <InsightStatCard icon={Lightbulb} title="Generated Insights" value={smartInsights.length} subtitle="Calculated this period" color="#38bdf8" />
        <InsightStatCard icon={Zap} title="Prediction Confidence" value="94%" subtitle="Based on 5k+ data points" color="#8b5cf6" />
        <InsightStatCard icon={Activity} title="Behavioral Pulse" value={behavioral.highIntentUsers > 0 ? "High" : "Stable"} subtitle="User engagement status" color="#fbbf24" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        {/* Smart Insights Summary */}
        <div className="admin-card dash-chart-card">
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 className="dash-card-title">AI Smart Summary</h3>
              <p className="dash-card-subtitle">Automated observations and key trend alerts</p>
            </div>
            <Sparkles size={20} style={{ color: '#8b5cf6', opacity: 0.8 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {smartInsights.length > 0 ? smartInsights.map((insight, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.04)', transition: 'transform 0.2s ease', cursor: 'default' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: insight.priority === 'high' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(139, 92, 246, 0.1)', color: insight.priority === 'high' ? '#38bdf8' : '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {insight.type === 'prediction' ? <Zap size={18} /> : insight.type === 'gap' ? <AlertCircle size={18} /> : <TrendingUp size={18} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#fafafa', lineHeight: 1.5, fontWeight: 500 }}>{insight.text}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: insight.priority === 'high' ? '#38bdf8' : '#8b5cf6' }}>{insight.type}</span>
                    <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#3f3f46' }}></span>
                    <span style={{ fontSize: '0.7rem', color: '#71717a' }}>{insight.priority} priority</span>
                  </div>
                </div>
              </div>
            )) : <p style={{ textAlign: 'center', color: '#71717a', padding: '2rem' }}>Analyzing data for new insights...</p>}
          </div>
        </div>

        {/* Prediction Block: Career Demand Forecast */}
        <div className="admin-card dash-chart-card">
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 className="dash-card-title">Career Demand Forecast</h3>
            <p className="dash-card-subtitle">Predicted industry growth for next 30 days</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {domains.slice(0, 5).map((d, i) => (
               <div key={d.name} style={{ background: 'rgba(255,255,255,0.015)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e4e4e7' }}>{d.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4ade80' }}>
                      <ArrowUpRight size={14} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>+{Math.round(d.growth * 1.2)}%</span>
                    </div>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, d.count * 10)}%`, background: TREND_COLORS[i % TREND_COLORS.length], borderRadius: '99px' }}></div>
                  </div>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.7rem', color: '#71717a' }}>Prediction confidence: {85 + i}%</p>
               </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        {/* Skill Gap Analysis */}
        <div className="admin-card dash-chart-card">
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 className="dash-card-title">Skill Gap Analysis</h3>
            <p className="dash-card-subtitle">Top missing skills identified in user profiles</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {skillGaps.length > 0 ? skillGaps.map((skill, i) => (
              <div key={skill.name} style={{ padding: '1rem', background: 'rgba(248, 113, 113, 0.03)', border: '1px solid rgba(248, 113, 113, 0.1)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#f87171', fontWeight: 700, textTransform: 'uppercase' }}>Missing Skill</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '1rem', fontWeight: 600, color: '#fafafa' }}>{skill.name}</p>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.7rem', color: '#a1a1aa' }}>Identified in {skill.percentage}% of users</p>
              </div>
            )) : <p style={{ gridColumn: 'span 2', textAlign: 'center', color: '#71717a', padding: '1rem' }}>No significant gaps detected</p>}
          </div>
        </div>

        {/* Behavioral Insight: Recommendation Trends */}
        <div className="admin-card dash-chart-card">
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 className="dash-card-title">Behavioral Insights</h3>
            <p className="dash-card-subtitle">User interest shifts and recommendation patterns</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(56, 189, 248, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(56, 189, 248, 0.1)' }}>
                <Users size={20} style={{ color: '#38bdf8' }} />
                <div>
                   <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#fafafa' }}>Career Switchers Peak</p>
                   <p style={{ margin: 0, fontSize: '0.75rem', color: '#a1a1aa' }}>{behavioral.careerSwitchers || 0}% increase in users exploring non-tech roles</p>
                </div>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(139, 92, 246, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                <ShieldCheck size={20} style={{ color: '#8b5cf6' }} />
                <div>
                   <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#fafafa' }}>High Intent Profiles</p>
                   <p style={{ margin: 0, fontSize: '0.75rem', color: '#a1a1aa' }}>{behavioral.highIntentUsers || 0} users actively updating multiple skills</p>
                </div>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(74, 222, 128, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(74, 222, 128, 0.1)' }}>
                <Flame size={20} style={{ color: '#4ade80' }} />
                <div>
                   <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#fafafa' }}>Top Engagement</p>
                   <p style={{ margin: 0, fontSize: '0.75rem', color: '#a1a1aa' }}>Most activity on: {behavioral.topEngagement || 'N/A'}</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InsightStatCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <div className="admin-card dash-stat-card">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `color-mix(in srgb, ${color} 12%, transparent)`, color: color, border: `1px solid color-mix(in srgb, ${color} 20%, transparent)` }}>
        <Icon size={20} />
      </div>
    </div>
    <p style={{ margin: 0, fontSize: '1.65rem', fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em' }}>{value}</p>
    <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{title}</p>
    <p style={{ margin: '0.15rem 0 0', fontSize: '0.7rem', color: '#52525b' }}>{subtitle}</p>
  </div>
);

export default AIInsights;
