import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { adminApi } from '../../services/adminApi';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { toast } from 'react-hot-toast';
import { Plus } from 'lucide-react';
import emptyDataSvg from '../../assets/illustrations/empty-data.svg';
import '../../styles/admin.css';

const emptyCareer = { name: '', industry: '', salaryRange: '', description: '', growthRate: 'Medium', requiredSkills: '', jobRoles: '' };

const CareerManagement = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, limit: 10, search: '', industry: '' });
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentCareer, setCurrentCareer] = useState(emptyCareer);
  const [isEditing, setIsEditing] = useState(false);

  const fetchCareers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getCareers(params);
      setCareers(data.careers);
      setTotalPages(data.pages);
    } catch (err) { toast.error('Failed to load careers'); } 
    finally { setLoading(false); }
  }, [params]);

  useEffect(() => { fetchCareers(); }, [fetchCareers]);

  const handleSearch = useCallback((query) => setParams(prev => ({ ...prev, search: query, page: 1 })), []);
  const handlePageChange = useCallback((page) => setParams(prev => ({ ...prev, page })), []);

  const handleOpenModal = (career = null) => {
    if (career) {
      setCurrentCareer({
        ...career,
        requiredSkills: career.requiredSkills?.join(', ') || '',
        jobRoles: career.jobRoles?.join(', ') || ''
      });
      setIsEditing(true);
    } else {
      setCurrentCareer(emptyCareer);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...currentCareer,
      requiredSkills: currentCareer.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      jobRoles: currentCareer.jobRoles.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (isEditing) await adminApi.updateCareer(currentCareer._id, payload);
      else await adminApi.createCareer(payload);
      toast.success(`Career ${isEditing ? 'updated' : 'created'}`);
      setIsModalOpen(false);
      fetchCareers();
    } catch (err) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} career`);
    }
  };

  const confirmDelete = async () => {
    try {
      await adminApi.deleteCareer(currentCareer._id);
      toast.success('Career deleted');
      fetchCareers();
    } catch (err) { toast.error('Failed to delete career'); }
  };

  const columns = useMemo(() => [
    { header: 'Career Path', cell: info => <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{info.row.original.name}</div> },
    { header: 'Industry', cell: info => <div style={{ color: 'var(--text-muted)' }}>{info.row.original.industry}</div> },
    { 
      header: 'Growth', 
      cell: info => {
        const rate = info.row.original.growthRate;
        const color = rate === 'High' ? 'admin-status-active' : rate === 'Medium' ? 'admin-status-pending' : 'admin-status-blocked';
        return <span className={`admin-status-badge ${color}`}>{rate}</span>;
      } 
    },
    { header: 'Salary Range', cell: info => <div style={{ color: 'var(--text-muted)' }}>{info.row.original.salaryRange || 'N/A'}</div> },
    {
      header: 'Actions',
      cell: info => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => handleOpenModal(info.row.original)} className="admin-button" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>Edit</button>
          <button onClick={() => { setCurrentCareer(info.row.original); setIsDeleteOpen(true); }} className="admin-button danger" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', boxShadow: 'none' }}>Delete</button>
        </div>
      )
    }
  ], []);

  return (
    <div className="page-container page-fade-in">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Career Paths</h2>
          <p className="admin-page-subtitle">Manage career options and their required skills.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="admin-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Career
        </button>
      </div>

      <div className="admin-card">
        <div style={{ marginBottom: '1.5rem', maxWidth: '350px' }}><SearchBar onSearch={handleSearch} placeholder="Search careers or industries..." /></div>
        <div className="admin-table-container">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : careers.length === 0 ? (
            <div className="admin-empty-state">
              <img src={emptyDataSvg} className="admin-empty-icon" alt="No data" />
              <p className="admin-empty-text">No career paths found.</p>
            </div>
          ) : (
            <><DataTable data={careers} columns={columns} /><Pagination currentPage={params.page} totalPages={totalPages} onPageChange={handlePageChange} /></>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${isEditing ? 'Edit' : 'Add'} Career Path`}>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Career Name</label>
              <input required value={currentCareer.name} onChange={e=>setCurrentCareer({...currentCareer, name: e.target.value})} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Industry</label>
              <input required value={currentCareer.industry} onChange={e=>setCurrentCareer({...currentCareer, industry: e.target.value})} className="admin-input" />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Salary Range</label>
              <input placeholder="e.g. $80k - $120k" value={currentCareer.salaryRange} onChange={e=>setCurrentCareer({...currentCareer, salaryRange: e.target.value})} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Growth Rate</label>
              <select value={currentCareer.growthRate} onChange={e=>setCurrentCareer({...currentCareer, growthRate: e.target.value})} className="admin-input">
                <option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
              </select>
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Required Skills (comma separated)</label>
            <input placeholder="React, Node.js, SQL" value={currentCareer.requiredSkills} onChange={e=>setCurrentCareer({...currentCareer, requiredSkills: e.target.value})} className="admin-input" />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Job Roles (comma separated)</label>
            <input placeholder="Frontend Developer, Full Stack Engineer" value={currentCareer.jobRoles} onChange={e=>setCurrentCareer({...currentCareer, jobRoles: e.target.value})} className="admin-input" />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Description</label>
            <textarea rows="3" required value={currentCareer.description} onChange={e=>setCurrentCareer({...currentCareer, description: e.target.value})} className="admin-input" />
          </div>
          <div className="admin-action-row">
            <button type="button" onClick={() => setIsModalOpen(false)} className="admin-button-link admin-button">Cancel</button>
            <button type="submit" className="admin-button success">Save</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete} title="Delete Career" message={`Are you sure you want to delete ${currentCareer?.name}?`} confirmText="Delete" isDestructive={true} />
    </div>
  );
};

export default CareerManagement;
