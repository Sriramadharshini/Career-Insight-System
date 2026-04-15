import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { adminApi } from '../../services/adminApi';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { toast } from 'react-hot-toast';
import { Plus, Zap, Layers, TrendingUp, Award, Info, FileCode } from 'lucide-react';
import { SkillsHeroIllustration, EmptyStateIllustration } from '../../components/admin/AdminIllustrations';
import '../../styles/admin.css';


const emptySkill = { name: '', category: 'Other', demandLevel: 'Medium' };

const SkillsManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, limit: 10, search: '' });
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

  const handleSearch = useCallback((query) => {
    setParams(prev => ({ ...prev, search: query, page: 1 }));
  }, []);

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <h2 className="admin-page-title">Skills Library</h2>
            <p className="admin-page-subtitle">Manage all recognized skills for career analysis.</p>
          </div>
          <div style={{ width: '180px' }}>
            <SkillsHeroIllustration />
          </div>
        </div>
        <button onClick={() => handleOpenModal()} className="admin-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={16} /> Add Skill</button>
      </div>
      <div className="admin-card">
        <div className="admin-search-container">
          <SearchBar onSearch={handleSearch} placeholder="Search skills or categories..." />
        </div>
        <div className="admin-table-container">

          {loading ? (
            <div className="loading-spinner"></div>
          ) : items.length === 0 ? (
            <div className="admin-empty-state">
              <EmptyStateIllustration color="teal" />
              <p className="admin-empty-text">No skills found in the library.</p>
            </div>
          ) : (
            <><DataTable data={items} columns={columns} /><Pagination currentPage={params.page} totalPages={totalPages} onPageChange={p => setParams({...params, page: p})} /></>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${isEditing ? 'Edit' : 'Add'} Skill`}>
        <div className="admin-creation-container">
          <div className="creation-info-panel">
            <div className="creation-visual-box">
              <SkillsHeroIllustration />
            </div>
            <div className="creation-help-card">
              <h4><Info size={16} style={{ marginBottom: '-3px', marginRight: '8px' }} /> Ecosystem</h4>
              <p>Skills are the building blocks of career analysis. Ensure names are standardized (e.g., "Full Stack" instead of "Fullstack").</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="admin-form-hero">
            <div className="admin-section-divider">
              <span>Skill Identity</span>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Skill Name</label>
              <div className="admin-input-group">
                <Zap className="admin-input-icon" size={18} />
                <input required value={currentItem.name} onChange={e=>setCurrentItem({...currentItem, name: e.target.value})} className="admin-input admin-input-with-icon" placeholder="e.g. Artificial Intelligence" />
              </div>
            </div>

            <div className="admin-section-divider">
              <span>Classification</span>
            </div>

            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-label">Category</label>
                <div className="admin-input-group">
                  <Layers className="admin-input-icon" size={18} />
                  <select value={currentItem.category} onChange={e=>setCurrentItem({...currentItem, category: e.target.value})} className="admin-input admin-input-with-icon">
                    <option value="Frontend">Frontend Development</option>
                    <option value="Backend">Backend / API</option>
                    <option value="Database">Database Systems</option>
                    <option value="DevOps">Cloud & DevOps</option>
                    <option value="Design">UI/UX Design</option>
                    <option value="Soft Skill">Interpersonal / Soft Skill</option>
                    <option value="Other">Other Category</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Market Demand</label>
                <div className="admin-input-group">
                  <TrendingUp className="admin-input-icon" size={18} />
                  <select value={currentItem.demandLevel} onChange={e=>setCurrentItem({...currentItem, demandLevel: e.target.value})} className="admin-input admin-input-with-icon">
                    <option value="High">Extremely High</option>
                    <option value="Medium">Moderate Stability</option>
                    <option value="Low">Low / Specialized</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="admin-section-divider">
              <span>Expertise Alignment</span>
            </div>

            <div className="admin-form-group">
              <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} color="var(--accent-blue)" /> Featured / Trending Skill
              </label>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Marking a skill as trending will highlight it in the user's skill gap recommendations.</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setCurrentItem({...currentItem, trending: true})} className={`admin-button ${currentItem.trending ? '' : 'admin-button-link'}`} style={{ flex: 1 }}>Mark Trending</button>
                <button type="button" onClick={() => setCurrentItem({...currentItem, trending: false})} className={`admin-button ${!currentItem.trending ? '' : 'admin-button-link'}`} style={{ flex: 1 }}>Standard Skill</button>
              </div>
            </div>

            <div className="admin-action-row">
              <button type="button" onClick={() => setIsModalOpen(false)} className="admin-button-link admin-button">Cancel</button>
              <button type="submit" className="admin-button success"><Award size={16} style={{ marginRight: '8px' }} /> Save to Library</button>
            </div>
          </form>
        </div>
      </Modal>
      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete} title="Delete Skill" message="Are you sure?" confirmText="Delete" isDestructive={true} />
    </div>
  );
};

export default SkillsManagement;
