import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { adminApi } from '../../services/adminApi';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { toast } from 'react-hot-toast';
import { Plus } from 'lucide-react';
import emptyDataSvg from '../../assets/illustrations/empty-data.svg';
import '../../styles/admin.css';

const emptySkill = { name: '', category: 'Other', demandLevel: 'Medium' };

const SkillsManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(emptySkill);
  const [isEditing, setIsEditing] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getSkills(params);
      setItems(data.skills);
      setTotalPages(data.pages);
    } catch (err) { toast.error('Failed to load skills'); }
    finally { setLoading(false); }
  }, [params]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleOpenModal = (item = null) => {
    if (item) { setCurrentItem(item); setIsEditing(true); } 
    else { setCurrentItem(emptySkill); setIsEditing(false); }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) await adminApi.updateSkill(currentItem._id, currentItem);
      else await adminApi.createSkill(currentItem);
      toast.success(isEditing ? 'Updated' : 'Created');
      setIsModalOpen(false);
      fetchItems();
    } catch (err) { toast.error('Failed to save'); }
  };

  const toggleTrending = async (item) => {
    try {
      await adminApi.updateSkillTrending(item._id, !item.trending);
      toast.success(item.trending ? 'Removed from trending' : 'Marked trending');
      fetchItems();
    } catch (err) { toast.error('Failed to update trending'); }
  };

  const confirmDelete = async () => {
    try {
      await adminApi.deleteSkill(currentItem._id);
      toast.success('Deleted');
      fetchItems();
    } catch (err) { toast.error('Failed to delete'); }
  };

  const columns = useMemo(() => [
    { header: 'Skill Name', cell: info => <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{info.row.original.name}</div> },
    { header: 'Category', cell: info => <div style={{ color: 'var(--text-muted)' }}>{info.row.original.category}</div> },
    { header: 'Demand', cell: info => <div style={{ color: 'var(--text-muted)' }}>{info.row.original.demandLevel}</div> },
    { header: 'Trending', cell: info => <span className={`admin-status-badge ${info.row.original.trending ? 'admin-status-active' : ''}`}>{info.row.original.trending ? 'Yes' : 'No'}</span> },
    {
      header: 'Actions',
      cell: info => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => toggleTrending(info.row.original)} className="admin-button-link admin-button" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>{info.row.original.trending ? 'Untrend' : 'Trend'}</button>
          <button onClick={() => handleOpenModal(info.row.original)} className="admin-button" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>Edit</button>
          <button onClick={() => { setCurrentItem(info.row.original); setIsDeleteOpen(true); }} className="admin-button danger" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', boxShadow: 'none' }}>Delete</button>
        </div>
      )
    }
  ], []);

  return (
    <div className="page-container page-fade-in">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Skills Library</h2>
          <p className="admin-page-subtitle">Manage all recognized skills for career analysis.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="admin-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={16} /> Add Skill</button>
      </div>
      <div className="admin-card">
        <div className="admin-table-container">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : items.length === 0 ? (
            <div className="admin-empty-state">
              <img src={emptyDataSvg} className="admin-empty-icon" alt="No data" />
              <p className="admin-empty-text">No skills found in the library.</p>
            </div>
          ) : (
            <><DataTable data={items} columns={columns} /><Pagination currentPage={params.page} totalPages={totalPages} onPageChange={p => setParams({...params, page: p})} /></>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${isEditing ? 'Edit' : 'Add'} Skill`}>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-label">Name</label>
            <input required value={currentItem.name} onChange={e=>setCurrentItem({...currentItem, name: e.target.value})} className="admin-input" />
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Category</label>
              <select value={currentItem.category} onChange={e=>setCurrentItem({...currentItem, category: e.target.value})} className="admin-input">
                <option value="Frontend">Frontend</option><option value="Backend">Backend</option><option value="Database">Database</option><option value="DevOps">DevOps</option><option value="Design">Design</option><option value="Soft Skill">Soft Skill</option><option value="Other">Other</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Demand Level</label>
              <select value={currentItem.demandLevel} onChange={e=>setCurrentItem({...currentItem, demandLevel: e.target.value})} className="admin-input">
                <option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
              </select>
            </div>
          </div>
          <div className="admin-action-row">
            <button type="button" onClick={() => setIsModalOpen(false)} className="admin-button-link admin-button">Cancel</button>
            <button type="submit" className="admin-button success">Save</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete} title="Delete Skill" message="Are you sure?" confirmText="Delete" isDestructive={true} />
    </div>
  );
};

export default SkillsManagement;
