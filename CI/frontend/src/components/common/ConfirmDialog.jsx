import React from 'react';
import Modal from './Modal';
import '../../styles/admin.css';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", isDestructive = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <p style={{
          color: 'var(--text-muted)',
          background: 'var(--bg-soft)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid var(--border-soft)',
          margin: 0
        }}>
          {message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            onClick={onClose}
            className="admin-button-link admin-button"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`admin-button ${isDestructive ? 'danger' : 'success'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
