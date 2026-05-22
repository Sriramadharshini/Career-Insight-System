import React from 'react';
import { Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const MaintenancePage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: 'var(--radius-full)', color: '#fbbf24' }}>
            <Settings size={48} className="animate-spin-slow" />
          </div>
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Under Maintenance</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.6, margin: '0 auto' }}>
          We are currently performing emergency maintenance to upgrade the platform. We will be back online shortly. Thank you for your patience!
        </p>
      </motion.div>
    </div>
  );
};

export default MaintenancePage;
