import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/admin.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', marginTop: '1rem', borderTop: '1px solid var(--border-soft)' }}>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Page <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{currentPage}</span> of <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{totalPages}</span>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)',
            background: currentPage === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-soft)',
            color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-main)',
            fontSize: '0.85rem', fontWeight: 600,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: currentPage === 1 ? 0.6 : 1
          }}
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)',
            background: currentPage === totalPages ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-soft)',
            color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-main)',
            fontSize: '0.85rem', fontWeight: 600,
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: currentPage === totalPages ? 0.6 : 1
          }}
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
