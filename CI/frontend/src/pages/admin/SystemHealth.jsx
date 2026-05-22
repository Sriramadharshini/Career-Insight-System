import React from 'react';
import { Activity, Server, Database, Brain, HardDrive, Wifi, Clock, CheckCircle2 } from 'lucide-react';
import '../../styles/admin.css';

const services = [
  { name: 'API Server', icon: Server, status: 'Operational', uptime: '99.99%', latency: '45ms', color: '#4ade80' },
  { name: 'Database', icon: Database, status: 'Operational', uptime: '99.97%', latency: '12ms', color: '#4ade80' },
  { name: 'AI Engine', icon: Brain, status: 'Operational', uptime: '99.8%', latency: '850ms', color: '#fbbf24' },
  { name: 'File Storage', icon: HardDrive, status: 'Operational', uptime: '100%', latency: '28ms', color: '#4ade80' },
  { name: 'CDN / Assets', icon: Wifi, status: 'Operational', uptime: '99.99%', latency: '15ms', color: '#4ade80' },
];

const incidents = [
  { date: 'May 5, 2026', title: 'AI Engine latency spike', duration: '12 min', resolved: true },
  { date: 'Apr 28, 2026', title: 'Database maintenance window', duration: '45 min', resolved: true },
  { date: 'Apr 15, 2026', title: 'CDN cache invalidation', duration: '5 min', resolved: true },
];

const SystemHealth = () => (
  <div className="page-container page-fade-in">
    <div style={{ marginBottom: '2rem' }}>
      <h2 className="admin-page-title" style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>System Health</h2>
      <p className="admin-page-subtitle" style={{ fontSize: '0.95rem' }}>Real-time infrastructure monitoring and service status.</p>
    </div>

    {/* Overall Status Banner */}
    <div className="admin-card" style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', background: 'rgba(74, 222, 128, 0.04)', border: '1px solid rgba(74, 222, 128, 0.12)', borderRadius: 'var(--radius-md)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ width: 14, height: 14, borderRadius: 'var(--radius-xl)', background: '#4ade80' }}/>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 14, height: 14, borderRadius: 'var(--radius-xl)', background: '#4ade80', animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite' }}/>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#4ade80' }}>All Systems Operational</p>
          <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#71717a' }}>Last checked: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a1a1aa' }}>
        <Clock size={14} style={{ verticalAlign: 'middle', marginRight: 4 }}/>Uptime: 99.9%
      </div>
    </div>

    {/* Service Cards */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
      {services.map(s => (
        <div key={s.name} className="admin-card dash-chart-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `color-mix(in srgb, ${s.color} 10%, transparent)`, color: s.color, border: `1px solid color-mix(in srgb, ${s.color} 18%, transparent)` }}>
              <s.icon size={18}/>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#fafafa' }}>{s.name}</h4>
              <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: s.color, fontWeight: 600 }}>{s.status}</p>
            </div>
            <CheckCircle2 size={16} style={{ color: s.color }}/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#fafafa' }}>{s.uptime}</p>
              <p style={{ margin: '2px 0 0', fontSize: '0.65rem', color: '#52525b' }}>Uptime</p>
            </div>
            <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#fafafa' }}>{s.latency}</p>
              <p style={{ margin: '2px 0 0', fontSize: '0.65rem', color: '#52525b' }}>Latency</p>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Recent Incidents */}
    <div className="admin-card dash-chart-card">
      <h3 className="dash-card-title" style={{ marginBottom: '1.25rem' }}>Recent Incidents</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {incidents.map((inc, i) => (
          <div key={i} className="dash-activity-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(74,222,128,0.08)', color: '#4ade80', flexShrink: 0 }}>
                <CheckCircle2 size={16}/>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#e4e4e7' }}>{inc.title}</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#52525b' }}>{inc.date} · Resolved in {inc.duration}</p>
              </div>
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#4ade80', background: 'rgba(74,222,128,0.08)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>Resolved</span>
          </div>
        ))}
      </div>
    </div>

    <style>{`@keyframes ping { 75%,100% { transform: scale(2.5); opacity: 0; } }`}</style>
  </div>
);

export default SystemHealth;
