import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/admin.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="admin-pagination-container">
      <div className="admin-pagination-text">
        Page <span>{currentPage}</span> of <span>{totalPages}</span>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="admin-pagination-btn"
        >
          <ChevronLeft size={16} />
          <span style={{ marginLeft: '0.25rem' }}>Previous</span>
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="admin-pagination-btn"
        >
          <span style={{ marginRight: '0.25rem' }}>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
