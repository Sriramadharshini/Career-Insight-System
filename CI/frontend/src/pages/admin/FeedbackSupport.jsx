import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { adminApi } from '../../services/adminApi';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { toast } from 'react-hot-toast';
import emptyDataSvg from '../../assets/illustrations/empty-data.svg';
import '../../styles/admin.css';

const FeedbackSupport = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getFeedback(params);
      setItems(data.feedbacks);
      setTotalPages(data.pages);
    } catch (err) { toast.error('Failed to load feedback'); }
    finally { setLoading(false); }
  }, [params]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const resolveFeedback = async (item) => {
    try {
      await adminApi.resolveFeedback(item._id);
      toast.success('Marked Resolved');
      fetchItems();
    } catch (err) { toast.error('Failed to resolve'); }
  };

  const confirmDelete = async () => {
    try {
      await adminApi.deleteFeedback(currentItem._id);
      toast.success('Deleted');
      fetchItems();
    } catch (err) { toast.error('Failed to delete'); }
  };

  const columns = useMemo(() => [
    { header: 'User', cell: info => <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{info.row.original.user?.name || info.row.original.userName || 'Anonymous'}</div> },
    { header: 'Message', cell: info => <div style={{ color: 'var(--text-muted)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{info.row.original.message}</div> },
    { header: 'Rating', cell: info => <div style={{ color: 'var(--text-muted)' }}>{info.row.original.rating} / 5</div> },
    { header: 'Status', cell: info => (
        <span className={`admin-status-badge ${info.row.original.status === 'Resolved' ? 'admin-status-active' : 'admin-status-pending'}`}>
          {info.row.original.status}
        </span>
    )},
    {
      header: 'Actions',
      cell: info => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {info.row.original.status === 'Pending' && (
            <button onClick={() => resolveFeedback(info.row.original)} className="admin-button success" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>Resolve</button>
          )}
          <button onClick={() => { setCurrentItem(info.row.original); setIsDeleteOpen(true); }} className="admin-button danger" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', boxShadow: 'none' }}>Delete</button>
        </div>
      )
    }
  ], []);

  return (
    <div className="page-container page-fade-in">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Feedback & Support</h2>
          <p className="admin-page-subtitle">Manage user feedback and support requests.</p>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-table-container">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : items.length === 0 ? (
            <div className="admin-empty-state">
              <img src={emptyDataSvg} className="admin-empty-icon" alt="No data" />
              <p className="admin-empty-text">No feedback received yet.</p>
            </div>
          ) : (
            <><DataTable data={items} columns={columns} /><Pagination currentPage={params.page} totalPages={totalPages} onPageChange={p => setParams({...params, page: p})} /></>
          )}
        </div>
      </div>
      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete} title="Delete Feedback" message="Are you sure?" confirmText="Delete" isDestructive={true} />
    </div>
  );
};

export default FeedbackSupport;
