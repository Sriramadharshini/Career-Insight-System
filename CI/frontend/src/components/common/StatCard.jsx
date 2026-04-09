import React from 'react';
import '../../styles/admin.css';

const StatCard = ({ title, value, icon: Icon, trend, colorClass = "var(--accent-blue)" }) => {
  return (
    <div className="admin-card admin-stat-card">
      <div className="admin-stat-info">
        <h3>{title}</h3>
        <p className="admin-stat-value">{value}</p>
        {trend && (
          <p style={{
            fontSize: '0.8rem',
            marginTop: '0.5rem',
            fontWeight: 500,
            color: trend > 0 ? 'var(--success)' : 'var(--danger)'
          }}>
            {trend > 0 ? '+' : ''}{trend}% from last month
          </p>
        )}
      </div>
      <div className="admin-stat-icon" style={{
        background: `color-mix(in srgb, ${colorClass} 15%, transparent)`,
        color: colorClass
      }}>
        <Icon size={24} />
      </div>
    </div>
  );
};

export default StatCard;
