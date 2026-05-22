import React, { useState, useEffect } from 'react';
import { Globe, AlertTriangle, ShieldCheck, Users, ToggleLeft, ToggleRight, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { adminApi } from '../../services/adminApi';
import '../../styles/admin.css';
import settingsIllustration from '../../assets/admin-illustrations/settings.png';

const Settings = () => {
  const [config, setConfig] = useState({
    maintenanceMode: false,
    aiEnabled: true,
    feedbackEnabled: true,
    analyticsTracking: true,
    // User Management
    allowRegistration: true,
    communityAccess: true,
    resumeUploads: true,
    profileVerification: false,
  });
  const [loading, setLoading] = useState(true);
  const [syncingKey, setSyncingKey] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await adminApi.getSettings();
        setConfig(prev => ({
          ...prev,
          ...data
        }));
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const toggle = async (key, label) => {
    const newValue = !config[key];
    const newConfig = { ...config, [key]: newValue };
    
    setSyncingKey(key);
    setConfig(newConfig);
    
    try {
      await adminApi.updateSettings(newConfig);
      if (newValue) {
        toast.success(`${label} Enabled`);
      } else {
        toast.error(`${label} Disabled`);
      }
    } catch (err) {
      toast.error(`${label} update failed`);
      setConfig(prev => ({ ...prev, [key]: !newValue }));
    } finally {
      setSyncingKey(null);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container page-fade-in">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img src={settingsIllustration} alt="Settings Illustration" style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} />
          <div>
            <h2 className="admin-page-title" style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>Platform Settings</h2>
            <p className="admin-page-subtitle" style={{ fontSize: '0.95rem' }}>Core system configuration, security, and user access management.</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(74, 222, 128, 0.08)', border: '1px solid rgba(74, 222, 128, 0.2)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', color: '#4ade80', fontSize: '0.85rem', fontWeight: 700 }}>
          <Save size={14} />
          Enterprise Sync Active
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {/* Platform Controls */}
        <SettingsSection icon={Globe} title="Platform Controls" color="#38bdf8">
          <ToggleRow label="Analytics Tracking" desc="Collect anonymized usage data for insights" value={config.analyticsTracking} onToggle={() => toggle('analyticsTracking', 'Analytics Tracking')} syncing={syncingKey === 'analyticsTracking'} />
          <ToggleRow label="User Feedback" desc="Enable feedback submission portal" value={config.feedbackEnabled} onToggle={() => toggle('feedbackEnabled', 'User Feedback')} syncing={syncingKey === 'feedbackEnabled'} />
        </SettingsSection>

        {/* User Management */}
        <SettingsSection icon={Users} title="User Management" color="#4ade80">
          <ToggleRow label="User Registration" desc="Allow new users to create accounts" value={config.allowRegistration} onToggle={() => toggle('allowRegistration', 'User Registration')} syncing={syncingKey === 'allowRegistration'} />
          <ToggleRow label="Community Access" desc="Enable community module for interaction" value={config.communityAccess} onToggle={() => toggle('communityAccess', 'Community Access')} syncing={syncingKey === 'communityAccess'} />
          <ToggleRow label="Resume Uploads" desc="Enable AI-powered resume analysis" value={config.resumeUploads} onToggle={() => toggle('resumeUploads', 'Resume Uploads')} syncing={syncingKey === 'resumeUploads'} />
          <ToggleRow label="Profile Verification" desc="Enforce email/identity verification" value={config.profileVerification} onToggle={() => toggle('profileVerification', 'Profile Verification')} syncing={syncingKey === 'profileVerification'} />
        </SettingsSection>

        {/* Maintenance Mode */}
        <SettingsSection icon={AlertTriangle} title="Maintenance Mode" color="#fbbf24" highlight={config.maintenanceMode}>
          <ToggleRow label="Emergency Maintenance" desc="Lock platform for critical updates" value={config.maintenanceMode} onToggle={() => toggle('maintenanceMode', 'Emergency Maintenance')} warning syncing={syncingKey === 'maintenanceMode'} />
          {config.maintenanceMode && (
            <div style={{ marginTop: '1rem', padding: '0.85rem', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600 }}>⚠ Maintenance mode is active. Public access is restricted.</p>
            </div>
          )}
        </SettingsSection>

        {/* Security & System Info */}
        <SettingsSection icon={ShieldCheck} title="Security & System" color="#f472b6">
          <div style={{ padding: '0.5rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>System Version</span>
              <span style={{ fontSize: '0.85rem', color: '#fafafa', fontWeight: 600 }}>v2.5.0-stable</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Encryption Protocol</span>
              <span style={{ fontSize: '0.85rem', color: '#4ade80', fontWeight: 700 }}>AES-256 GCM</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Database Cluster</span>
              <span style={{ fontSize: '0.85rem', color: '#fafafa', fontWeight: 600 }}>AWS Mumbai (ap-south-1)</span>
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};

const SettingsSection = ({ icon: Icon, title, color, highlight, children }) => (
  <div className="admin-card dash-chart-card" style={{ border: highlight ? `1px solid ${color}40` : undefined }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
      <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}18`, color }}>
        <Icon size={18}/>
      </div>
      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#fafafa' }}>{title}</h3>
    </div>
    {children}
  </div>
);

const ToggleRow = ({ label, desc, value, onToggle, warning, syncing }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
    <div style={{ paddingRight: '1rem' }}>
      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#e4e4e7' }}>{label}</p>
      <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#71717a' }}>{desc}</p>
    </div>
    <button onClick={onToggle} disabled={syncing} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {syncing && <div className="loading-spinner" style={{ width: 14, height: 14, borderWidth: 2, margin: 0, position: 'absolute' }}></div>}
      {value ? <ToggleRight size={28} style={{ color: warning ? '#fbbf24' : '#4ade80', opacity: syncing ? 0.3 : 1 }}/> : <ToggleLeft size={28} style={{ color: '#3f3f46', opacity: syncing ? 0.3 : 1 }}/>}
    </button>
  </div>
);

export default Settings;
