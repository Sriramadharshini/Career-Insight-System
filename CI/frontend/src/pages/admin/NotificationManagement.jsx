import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { toast } from 'react-hot-toast';
import { Plus } from 'lucide-react';
import emptyDataSvg from '../../assets/illustrations/empty-data.svg';
import '../../styles/admin.css';

const emptyNotification = { title: '', message: '', type: 'Info' };

const NotificationManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(emptyNotification);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getNotifications();
      setItems(data.notifications);
    } catch (err) { toast.error('Failed to load notifications'); }
    finally { setLoading(false); }
  };

  const handleOpenModal = () => {
    setCurrentItem(emptyNotification);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createNotification(currentItem);
      toast.success('Notification Sent');
      setIsModalOpen(false);
      fetchItems();
    } catch (err) { toast.error('Failed to send'); }
  };

  const confirmDelete = async () => {
    try {
      await adminApi.deleteNotification(currentItem._id);
      toast.success('Deleted');
      fetchItems();
    } catch (err) { toast.error('Failed to delete'); }
  };

  const columns = [
    { header: 'Title', cell: info => <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{info.row.original.title}</div> },
    { header: 'Type', cell: info => <div style={{ color: 'var(--text-muted)' }}>{info.row.original.type}</div> },
    { header: 'Date', cell: info => <div style={{ color: 'var(--text-muted)' }}>{new Date(info.row.original.createdAt).toLocaleString()}</div> },
    {
      header: 'Actions',
      cell: info => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => { setCurrentItem(info.row.original); setIsDeleteOpen(true); }} className="admin-button danger" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', boxShadow: 'none' }}>Delete</button>
        </div>
      )
    }
  ];

  return (
    <div className="page-container page-fade-in">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Notifications</h2>
          <p className="admin-page-subtitle">Manage system broadcasts and announcements.</p>
        </div>
        <button onClick={handleOpenModal} className="admin-button" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Plus size={16} /> Send Broadcast</button>
      </div>
      <div className="admin-card">
        <div className="admin-table-container">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : items.length === 0 ? (
            <div className="admin-empty-state">
              <img src={emptyDataSvg} className="admin-empty-icon" alt="No data" />
              <p className="admin-empty-text">No broadcast history found.</p>
            </div>
          ) : (
            <DataTable data={items} columns={columns} />
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Send Notification">
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-label">Title</label>
            <input required value={currentItem.title} onChange={e=>setCurrentItem({...currentItem, title: e.target.value})} className="admin-input" />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Type</label>
            <select value={currentItem.type} onChange={e=>setCurrentItem({...currentItem, type: e.target.value})} className="admin-input">
              <option value="Info">Info</option><option value="Warning">Warning</option><option value="Success">Success</option><option value="Announcement">Announcement</option>
            </select>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Message</label>
            <textarea required rows={3} value={currentItem.message} onChange={e=>setCurrentItem({...currentItem, message: e.target.value})} className="admin-input" />
          </div>
          <div className="admin-action-row">
            <button type="button" onClick={() => setIsModalOpen(false)} className="admin-button-link admin-button">Cancel</button>
            <button type="submit" className="admin-button success">Send to All</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete} title="Delete Notification" message="Are you sure?" confirmText="Delete" isDestructive={true} />
    </div>
  );
};

export default NotificationManagement;
