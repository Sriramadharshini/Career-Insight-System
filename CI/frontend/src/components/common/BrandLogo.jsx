import React from 'react';
import { Sparkles } from 'lucide-react';

const BrandLogo = ({ size = 24, showText = true, className = "" }) => {
  return (
    <div className={`brand-logo-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div className="brand-mark-square" style={{
        display: 'grid',
        placeItems: 'center',
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(56, 189, 248, 0.1) 100%)',
        color: '#38bdf8',
        boxShadow: '0 8px 24px rgba(56, 189, 248, 0.25)',
        border: '1px solid rgba(56, 189, 248, 0.4)',
        flexShrink: 0
      }}>
        <Sparkles size={size} strokeWidth={2.5} color="#38bdf8" />
      </div>
      
      {showText && (
        <div className="brand-text" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.2rem', 
            fontWeight: 800, 
            color: '#ffffff',
            letterSpacing: '-0.01em',
            lineHeight: 1.1
          }}>
            Career Insight
          </h1>
          <p style={{ 
            margin: 0, 
            fontSize: '0.75rem', 
            color: 'rgba(255, 255, 255, 0.5)',
            fontWeight: 500,
            letterSpacing: '0.01em',
            lineHeight: 1
          }}>
            Intelligent career building platform
          </p>
        </div>
      )}
    </div>
  );
};


export default BrandLogo;
