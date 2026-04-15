import React from 'react';

const GlobalDefs = () => (
  <defs>
    <linearGradient id="glowBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#38bdf8" />
      <stop offset="100%" stopColor="#0ea5e9" />
    </linearGradient>
    <linearGradient id="glowPurple" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#c084fc" />
      <stop offset="100%" stopColor="#9333ea" />
    </linearGradient>
    <linearGradient id="glowGreen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#4ade80" />
      <stop offset="100%" stopColor="#16a34a" />
    </linearGradient>
    <linearGradient id="glowOrange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#fbbf24" />
      <stop offset="100%" stopColor="#d97706" />
    </linearGradient>
    <linearGradient id="glowPink" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#f472b6" />
      <stop offset="100%" stopColor="#db2777" />
    </linearGradient>
    <linearGradient id="glowCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#22d3ee" />
      <stop offset="100%" stopColor="#0891b2" />
    </linearGradient>
    <linearGradient id="glowTeal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#2dd4bf" />
      <stop offset="100%" stopColor="#0f766e" />
    </linearGradient>
    <linearGradient id="glowIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#818cf8" />
      <stop offset="100%" stopColor="#4338ca" />
    </linearGradient>
    <filter id="glassBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" />
    </filter>
  </defs>
);

export const DashboardHeroIllustration = () => (
  <svg viewBox="0 0 400 240" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}>
    <GlobalDefs />
    <g opacity="0.3">
      <path d="M50 200 L350 200 M50 180 L350 180 M50 160 L350 160 M50 140 L350 140" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <path d="M100 220 L100 120 M150 220 L150 120 M200 220 L200 120 M250 220 L250 120 M300 220 L300 120" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    </g>
    <rect x="80" y="40" width="160" height="120" rx="20" fill="rgba(56, 189, 248, 0.1)" stroke="url(#glowBlue)" strokeWidth="2" style={{ backdropFilter: 'blur(10px)' }} />
    <circle cx="280" cy="80" r="40" fill="rgba(192, 132, 252, 0.15)" stroke="url(#glowPurple)" strokeWidth="2" />
    <rect x="100" y="100" width="70" height="12" rx="6" fill="url(#glowBlue)" opacity="0.8" />
    <rect x="100" y="120" width="110" height="12" rx="6" fill="rgba(255,255,255,0.2)" />
    <circle cx="120" cy="70" r="15" fill="url(#glowGreen)" opacity="0.9" />
    <path d="M135 70 L240 80" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="4 4" />
    <circle cx="240" cy="80" r="4" fill="#fff" />
  </svg>
);

export const AnalyticsHeroIllustration = () => (
  <svg viewBox="0 0 400 240" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}>
    <GlobalDefs />
    <g transform="translate(40, 20)">
      <circle cx="160" cy="100" r="80" fill="url(#glowPurple)" filter="url(#glassBlur)" opacity="0.3" />
      <rect x="40" y="20" width="240" height="160" rx="24" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      <path d="M60 140 Q 100 140 120 100 T 180 80 T 260 60" fill="none" stroke="url(#glowBlue)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="120" cy="100" r="6" fill="#fff" stroke="url(#glowBlue)" strokeWidth="3" />
      <circle cx="180" cy="80" r="6" fill="#fff" stroke="url(#glowBlue)" strokeWidth="3" />
      <circle cx="260" cy="60" r="6" fill="#fff" stroke="url(#glowBlue)" strokeWidth="3" />
      <rect x="220" y="-10" width="80" height="30" rx="15" fill="rgba(16, 185, 129, 0.2)" stroke="url(#glowGreen)" strokeWidth="1.5" />
      <circle cx="235" cy="5" r="5" fill="#4ade80" />
      <rect x="250" y="3" width="35" height="4" rx="2" fill="rgba(255,255,255,0.5)" />
    </g>
  </svg>
);

export const UsersHeroIllustration = () => (
  <svg viewBox="0 0 400 240" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}>
    <GlobalDefs />
    <g opacity="0.3">
      <circle cx="200" cy="120" r="100" stroke="url(#glowGreen)" strokeWidth="1" fill="none" />
      <circle cx="200" cy="120" r="70" stroke="url(#glowGreen)" strokeWidth="1" strokeDasharray="5 5" fill="none" />
    </g>
    <circle cx="200" cy="120" r="40" fill="rgba(34, 197, 94, 0.15)" stroke="url(#glowGreen)" strokeWidth="2" style={{ backdropFilter: 'blur(10px)' }} />
    <circle cx="200" cy="120" r="15" fill="url(#glowGreen)" opacity="0.9" />
    <circle cx="120" cy="80" r="25" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    <circle cx="120" cy="80" r="8" fill="#fff" />
    <path d="M140 90 L170 105" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
    <circle cx="280" cy="160" r="25" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    <circle cx="280" cy="160" r="8" fill="#fff" />
    <path d="M260 150 L230 135" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
  </svg>
);

export const JobsHeroIllustration = () => (
  <svg viewBox="0 0 400 240" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}>
    <GlobalDefs />
    <rect x="80" y="80" width="80" height="120" rx="4" fill="url(#glowOrange)" opacity="0.15" stroke="url(#glowOrange)" strokeWidth="2" />
    <rect x="180" y="40" width="80" height="160" rx="4" fill="url(#glowOrange)" opacity="0.1" stroke="url(#glowOrange)" strokeWidth="1" />
    <rect x="280" y="100" width="80" height="100" rx="4" fill="url(#glowOrange)" opacity="0.2" stroke="url(#glowOrange)" strokeWidth="2" />
    
    <path d="M100 100 L140 100 M100 120 L140 120 M100 140 L140 140 M100 160 L140 160" stroke="#fff" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
    <path d="M200 60 L240 60 M200 80 L240 80 M200 100 L240 100 M200 120 L240 120 M200 140 L240 140" stroke="#fff" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
    <path d="M300 120 L340 120 M300 140 L340 140 M300 160 L340 160" stroke="#fff" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
    
    <circle cx="220" cy="160" r="30" fill="rgba(255,255,255,0.1)" stroke="#fff" strokeWidth="2" style={{ backdropFilter: 'blur(4px)' }} />
    <path d="M210 160 L220 170 L235 150" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CareersHeroIllustration = () => (
  <svg viewBox="0 0 400 240" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}>
    <GlobalDefs />
    <path d="M60 180 C 140 180, 160 80, 240 80" fill="none" stroke="url(#glowPurple)" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" opacity="0.5" />
    <path d="M60 180 C 120 180, 140 120, 260 140" fill="none" stroke="url(#glowPurple)" strokeWidth="6" strokeLinecap="round" />
    <path d="M260 140 C 300 140, 320 60, 360 60" fill="none" stroke="url(#glowPurple)" strokeWidth="6" strokeLinecap="round" />
    
    <circle cx="60" cy="180" r="8" fill="#fff" stroke="url(#glowPurple)" strokeWidth="3" />
    <circle cx="260" cy="140" r="10" fill="url(#glowPurple)" stroke="#fff" strokeWidth="2" />
    <circle cx="360" cy="60" r="12" fill="#c084fc" />
    <circle cx="240" cy="80" r="6" fill="#fff" opacity="0.5" />
    <circle cx="160" cy="120" r="20" fill="rgba(192, 132, 252, 0.2)" filter="url(#glassBlur)" />
  </svg>
);

export const CoursesHeroIllustration = () => (
  <svg viewBox="0 0 400 240" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}>
    <GlobalDefs />
    <g transform="translate(60, 40)">
      <rect x="0" y="80" width="160" height="40" rx="8" fill="rgba(34, 211, 238, 0.1)" stroke="url(#glowCyan)" strokeWidth="2" />
      <rect x="20" y="40" width="120" height="40" rx="8" fill="rgba(34, 211, 238, 0.15)" stroke="url(#glowCyan)" strokeWidth="2" />
      <rect x="40" y="0" width="80" height="40" rx="8" fill="rgba(34, 211, 238, 0.2)" stroke="url(#glowCyan)" strokeWidth="2" />
      
      <circle cx="60" cy="20" r="4" fill="#fff" />
      <path d="M 70 20 L 100 20" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="60" r="4" fill="#fff" />
      <path d="M 50 60 L 120 60" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="100" r="4" fill="#fff" />
      <path d="M 30 100 L 140 100" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </g>
    <circle cx="300" cy="100" r="50" fill="url(#glowCyan)" filter="url(#glassBlur)" opacity="0.15" />
    <path d="M280 80 L320 120 M320 80 L280 120" stroke="url(#glowCyan)" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
  </svg>
);

export const AssessmentsHeroIllustration = () => (
  <svg viewBox="0 0 400 240" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}>
    <GlobalDefs />
    <path d="M100 120 A 80 80 0 1 1 260 120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" strokeLinecap="round" />
    <path d="M100 120 A 80 80 0 0 1 200 45" fill="none" stroke="url(#glowOrange)" strokeWidth="12" strokeLinecap="round" />
    <circle cx="180" cy="120" r="50" fill="rgba(251, 191, 36, 0.1)" stroke="url(#glowOrange)" strokeWidth="2" />
    <path d="M165 120 L175 130 L195 110" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    
    <rect x="280" y="80" width="60" height="20" rx="10" fill="rgba(255,255,255,0.05)" />
    <rect x="280" y="120" width="80" height="20" rx="10" fill="url(#glowOrange)" opacity="0.8" />
    <rect x="280" y="160" width="50" height="20" rx="10" fill="rgba(255,255,255,0.05)" />
  </svg>
);

export const NotificationsHeroIllustration = () => (
  <svg viewBox="0 0 400 240" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}>
    <GlobalDefs />
    <circle cx="200" cy="120" r="15" fill="url(#glowPink)" />
    <circle cx="200" cy="120" r="40" fill="none" stroke="url(#glowPink)" strokeWidth="3" opacity="0.8" strokedasharray="8 4" />
    <circle cx="200" cy="120" r="70" fill="none" stroke="url(#glowPink)" strokeWidth="2" opacity="0.4" />
    <circle cx="200" cy="120" r="100" fill="none" stroke="url(#glowPink)" strokeWidth="1" opacity="0.2" />
    
    <path d="M160 80 L185 105" stroke="#fff" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
    <path d="M240 80 L215 105" stroke="#fff" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
    <path d="M240 160 L215 135" stroke="#fff" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
    <path d="M160 160 L185 135" stroke="#fff" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
    
    <circle cx="160" cy="80" r="4" fill="#fff" />
    <circle cx="240" cy="80" r="4" fill="#fff" />
    <circle cx="240" cy="160" r="4" fill="#fff" />
    <circle cx="160" cy="160" r="4" fill="#fff" />
  </svg>
);

export const SkillsHeroIllustration = () => (
  <svg viewBox="0 0 400 240" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}>
    <GlobalDefs />
    <path d="M200 40 L260 75 L260 145 L200 180 L140 145 L140 75 Z" fill="rgba(45, 212, 191, 0.1)" stroke="url(#glowTeal)" strokeWidth="2" />
    <path d="M200 80 L230 100 L230 140 L200 160 L170 140 L170 100 Z" fill="url(#glowTeal)" opacity="0.3" filter="url(#glassBlur)" />
    
    <circle cx="200" cy="40" r="8" fill="#fff" stroke="url(#glowTeal)" strokeWidth="2" />
    <circle cx="260" cy="75" r="8" fill="#fff" stroke="url(#glowTeal)" strokeWidth="2" />
    <circle cx="260" cy="145" r="8" fill="#fff" stroke="url(#glowTeal)" strokeWidth="2" />
    <circle cx="200" cy="180" r="8" fill="#fff" stroke="url(#glowTeal)" strokeWidth="2" />
    <circle cx="140" cy="145" r="8" fill="#fff" stroke="url(#glowTeal)" strokeWidth="2" />
    <circle cx="140" cy="75" r="8" fill="#fff" stroke="url(#glowTeal)" strokeWidth="2" />
    
    <path d="M200 40 L200 80 M260 75 L230 100 M260 145 L230 140 M200 180 L200 160 M140 145 L170 140 M140 75 L170 100" stroke="#fff" strokeWidth="2" opacity="0.4" />
    <circle cx="200" cy="120" r="12" fill="#fff" />
  </svg>
);

export const FeedbackHeroIllustration = () => (
  <svg viewBox="0 0 400 240" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}>
    <GlobalDefs />
    <path d="M120 60 L240 60 A 20 20 0 0 1 260 80 L260 140 A 20 20 0 0 1 240 160 L160 160 L120 190 L120 160 L100 160 A 20 20 0 0 1 80 140 L80 80 A 20 20 0 0 1 100 60 Z" fill="rgba(129, 140, 248, 0.15)" stroke="url(#glowIndigo)" strokeWidth="2" />
    
    <path d="M200 100 L320 100 A 20 20 0 0 1 340 120 L340 180 A 20 20 0 0 1 320 200 L240 200 L200 230 L200 200 L180 200 A 20 20 0 0 1 160 180 L160 120 A 20 20 0 0 1 180 100 Z" fill="rgba(129, 140, 248, 0.05)" stroke="url(#glowIndigo)" strokeWidth="2" strokeDasharray="6 6" />

    <rect x="120" y="90" width="80" height="6" rx="3" fill="url(#glowIndigo)" />
    <rect x="120" y="110" width="100" height="6" rx="3" fill="#fff" opacity="0.5" />
    <rect x="120" y="130" width="60" height="6" rx="3" fill="#fff" opacity="0.3" />
    
    <circle cx="280" cy="140" r="4" fill="#fff" />
    <circle cx="260" cy="140" r="4" fill="#fff" opacity="0.5" />
    <circle cx="300" cy="140" r="4" fill="#fff" opacity="0.5" />
  </svg>
);

export const EmptyStateIllustration = ({ color = 'blue' }) => {
  const gradientId = color === 'purple' ? 'glowPurple' : color === 'orange' ? 'glowOrange' : color === 'pink' ? 'glowPink' : color === 'green' ? 'glowGreen' : color === 'cyan' ? 'glowCyan' : color === 'teal' ? 'glowTeal' : color === 'indigo' ? 'glowIndigo' : 'glowBlue';
  
  return (
    <svg viewBox="0 0 200 160" style={{ width: '100%', maxWidth: '200px', height: 'auto', margin: '0 auto', opacity: 0.8 }}>
      <GlobalDefs />
      <rect x="40" y="20" width="120" height="100" rx="20" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2" strokeDasharray="8 8" />
      <circle cx="100" cy="70" r="30" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      <circle cx="100" cy="70" r="12" fill="none" stroke={`url(#${gradientId})`} strokeWidth="3" />
      <path d="M109 79 L120 90" stroke={`url(#${gradientId})`} strokeWidth="3" strokeLinecap="round" />
      <rect x="80" y="130" width="40" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
    </svg>
  );
};
