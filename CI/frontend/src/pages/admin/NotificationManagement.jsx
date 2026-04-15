import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../services/adminApi';
import SearchBar from '../../components/common/SearchBar';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { toast } from 'react-hot-toast';
import { Plus, Send, Bell, Megaphone, Info, MessageSquare, AlertCircle } from 'lucide-react';
import { NotificationsHeroIllustration, EmptyStateIllustration } from '../../components/admin/AdminIllustrations';
import '../../styles/admin.css';

const emptyNotification = { title: '', message: '', type: 'Info' };

const NotificationManagement = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(emptyNotification);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getNotifications();
      setItems(data.notifications || []);
      setFilteredItems(data.notifications || []);
    } catch (err) { toast.error('Failed to load notifications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredItems(items);
    } else {
      const lowerQuery = query.toLowerCase();
      setFilteredItems(items.filter(item => 
        item.title?.toLowerCase().includes(lowerQuery) || 
        item.message?.toLowerCase().includes(lowerQuery)
      ));
    }
  }, [items]);

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <h2 className="admin-page-title">Notifications</h2>
            <p className="admin-page-subtitle">Manage system broadcasts and announcements.</p>
          </div>
          <div style={{ width: '180px' }}>
            <NotificationsHeroIllustration />
          </div>
        </div>
        <button onClick={handleOpenModal} className="admin-button" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Plus size={16} /> Send Broadcast</button>
      </div>
      <div className="admin-card">
        <div className="admin-search-container">
          <SearchBar onSearch={handleSearch} placeholder="Search broadcast history..." />
        </div>
        <div className="admin-table-container">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : filteredItems.length === 0 ? (
            <div className="admin-empty-state">
              <EmptyStateIllustration color="pink" />
              <p className="admin-empty-text">No broadcast history found.</p>
            </div>
          ) : (
            <DataTable data={filteredItems} columns={columns} />
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Send System Broadcast">
        <div className="admin-creation-container">
          <div className="creation-info-panel">
            <div className="creation-visual-box">
              <NotificationsHeroIllustration />
            </div>
            <div className="creation-help-card">
              <h4><Bell size={16} style={{ marginBottom: '-3px', marginRight: '8px' }} /> Broadcast Scope</h4>
              <p>System broadcasts are sent to all registered users. Use "Announcement" for important platform updates.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="admin-form-hero">
            <div className="admin-section-divider">
              <span>Message Header</span>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Broadcast Title</label>
              <div className="admin-input-group">
                <Send className="admin-input-icon" size={18} />
                <input required value={currentItem.title} onChange={e=>setCurrentItem({...currentItem, title: e.target.value})} className="admin-input admin-input-with-icon" placeholder="e.g. Schedule Maintenance Tomorrow" />
              </div>
            </div>

            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-label">Notification Type</label>
                <div className="admin-input-group">
                  <Megaphone className="admin-input-icon" size={18} />
                  <select value={currentItem.type} onChange={e=>setCurrentItem({...currentItem, type: e.target.value})} className="admin-input admin-input-with-icon">
                    <option value="Info">General Info</option>
                    <option value="Announcement">Major Announcement</option>
                    <option value="Warning">System Warning</option>
                    <option value="Success">Success Update</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="admin-section-divider">
              <span>Detailed Content</span>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Full Message Content</label>
              <div className="admin-input-group">
                <MessageSquare className="admin-input-icon" size={18} style={{ top: '1.2rem', transform: 'none' }} />
                <textarea required rows={5} value={currentItem.message} onChange={e=>setCurrentItem({...currentItem, message: e.target.value})} className="admin-input admin-input-with-icon" placeholder="Write your announcement details here. Be clear and concise." />
              </div>
            </div>

            <div className="admin-action-row">
              <button type="button" onClick={() => setIsModalOpen(false)} className="admin-button-link admin-button">Cancel</button>
              <button type="submit" className="admin-button success"><Send size={16} style={{ marginRight: '8px' }} /> Send Broadcast to All</button>
            </div>
          </form>
        </div>
      </Modal>
      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete} title="Delete Notification" message="Are you sure?" confirmText="Delete" isDestructive={true} />
    </div>
  );
};

export default NotificationManagement;
