import React from 'react';

const ModernHomeIcon = ({ size = 24, color = "currentColor", className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: color !== "currentColor" ? `drop-shadow(0 2px 10px ${color}80)` : 'none' }}
    >
      {/* Outer sleek house silhouette */}
      <path 
        d="M12 2L2 10.5V21H22V10.5L12 2Z" 
        stroke={color} 
        strokeWidth="1.8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="transparent"
      />
      {/* Inner AI network connections */}
      <path d="M12 2L12 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
      <path d="M3 10L12 12L21 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Glowing data nodes */}
      <circle cx="12" cy="12" r="2.5" fill={color} />
      <circle cx="12" cy="2" r="1.5" fill={color} />
      <circle cx="12" cy="21" r="1.5" fill={color} />
      <circle cx="21" cy="10" r="1.5" fill={color} />
      <circle cx="3" cy="10" r="1.5" fill={color} />
    </svg>
  );
};

export default ModernHomeIcon;
