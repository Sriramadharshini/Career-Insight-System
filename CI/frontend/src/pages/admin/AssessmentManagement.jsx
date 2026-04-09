import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { adminApi } from '../../services/adminApi';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { toast } from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import emptyDataSvg from '../../assets/illustrations/empty-data.svg';
import '../../styles/admin.css';

const emptyAssessment = {
  questionText: '',
  category: 'Technical Skills',
  options: [{ text: '', weightage: 0 }, { text: '', weightage: 0 }],
  relatedCareers: ''
};

const AssessmentManagement = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, limit: 10, category: '' });
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(emptyAssessment);
  const [isEditing, setIsEditing] = useState(false);

  const fetchAssessments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAssessments(params);
      setAssessments(data.assessments);
      setTotalPages(data.pages);
    } catch (err) { toast.error('Failed to load assessments'); } 
    finally { setLoading(false); }
  }, [params]);

  useEffect(() => { fetchAssessments(); }, [fetchAssessments]);

  const handlePageChange = useCallback((page) => setParams(prev => ({ ...prev, page })), []);
  const handleFilter = useCallback((e) => {
    const category = e.target.value;
    setParams(prev => ({ ...prev, category, page: 1 }));
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setCurrentItem({ ...item, relatedCareers: item.relatedCareers?.join(', ') || '' });
      setIsEditing(true);
    } else {
      setCurrentItem(emptyAssessment);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(currentItem.options.length < 2) return toast.error("Provide at least 2 options");
    const payload = {
      ...currentItem,
      relatedCareers: currentItem.relatedCareers.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (isEditing) await adminApi.updateAssessment(currentItem._id, payload);
      else await adminApi.createAssessment(payload);
      toast.success(isEditing ? 'Updated' : 'Created');
      setIsModalOpen(false);
      fetchAssessments();
    } catch (err) { toast.error('Failed to save'); }
  };

  const addOption = () => setCurrentItem({ ...currentItem, options: [...currentItem.options, { text: '', weightage: 0 }] });
  const removeOption = (idx) => setCurrentItem({ ...currentItem, options: currentItem.options.filter((_, i) => i !== idx) });
  const updateOption = (idx, field, value) => {
    const newOps = [...currentItem.options];
    newOps[idx][field] = value;
    setCurrentItem({ ...currentItem, options: newOps });
  };

  const confirmDelete = async () => {
    try {
      await adminApi.deleteAssessment(currentItem._id);
      toast.success('Deleted');
      fetchAssessments();
    } catch (err) { toast.error('Failed to delete'); }
  };

  const columns = useMemo(() => [
    { header: 'Question', cell: info => <div style={{ fontWeight: 600, color: 'var(--text-main)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={info.row.original.questionText}>{info.row.original.questionText}</div> },
    { header: 'Category', cell: info => <span className="admin-status-badge admin-status-active">{info.row.original.category}</span> },
    { header: 'Options', cell: info => <div style={{ color: 'var(--text-muted)' }}>{info.row.original.options.length}</div> },
    {
      header: 'Actions',
      cell: info => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
          <h2 className="admin-page-title">Assessments</h2>
          <p className="admin-page-subtitle">Manage assessment questions and configurations.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="admin-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Question
        </button>
      </div>

      <div className="admin-card">
        <div style={{ marginBottom: '1.5rem', maxWidth: '300px' }}>
          <select value={params.category} onChange={handleFilter} className="admin-input">
            <option value="">All Categories</option>
            <option value="Technical Skills">Technical Skills</option>
            <option value="Soft Skills">Soft Skills</option>
            <option value="Interest Areas">Interest Areas</option>
            <option value="Work Style">Work Style</option>
          </select>
        </div>
        <div className="admin-table-container">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : assessments.length === 0 ? (
            <div className="admin-empty-state">
              <img src={emptyDataSvg} className="admin-empty-icon" alt="No data" />
              <p className="admin-empty-text">No assessment questions found.</p>
            </div>
          ) : (
            <><DataTable data={assessments} columns={columns} /><Pagination currentPage={params.page} totalPages={totalPages} onPageChange={handlePageChange} /></>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${isEditing ? 'Edit' : 'Add'} Question`}>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-label">Question Text</label>
            <textarea required rows="2" value={currentItem.questionText} onChange={e=>setCurrentItem({...currentItem, questionText: e.target.value})} className="admin-input" />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Category</label>
            <select value={currentItem.category} onChange={e=>setCurrentItem({...currentItem, category: e.target.value})} className="admin-input">
              <option value="Technical Skills">Technical Skills</option><option value="Soft Skills">Soft Skills</option><option value="Interest Areas">Interest Areas</option><option value="Work Style">Work Style</option>
            </select>
          </div>
          <div className="admin-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ marginBottom: 0 }}>Options</label>
              <button type="button" onClick={addOption} className="admin-button-link" style={{ fontSize: '0.8rem' }}>+ Add Option</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentItem.options.map((opt, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input required placeholder="Option text" value={opt.text} onChange={e=>updateOption(idx, 'text', e.target.value)} className="admin-input" style={{ flex: 1 }} />
                  <input required type="number" placeholder="Weightage" value={opt.weightage} onChange={e=>updateOption(idx, 'weightage', e.target.value)} className="admin-input" style={{ width: '80px' }} />
                  <button type="button" onClick={() => removeOption(idx)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Related Careers (comma separated)</label>
            <input placeholder="Software Engineer, Data Scientist" value={currentItem.relatedCareers} onChange={e=>setCurrentItem({...currentItem, relatedCareers: e.target.value})} className="admin-input" />
          </div>
          <div className="admin-action-row">
            <button type="button" onClick={() => setIsModalOpen(false)} className="admin-button-link admin-button">Cancel</button>
            <button type="submit" className="admin-button success">Save</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete} title="Delete Question" message="Are you sure you want to delete this question? This cannot be undone." confirmText="Delete" isDestructive={true} />
    </div>
  );
};

export default AssessmentManagement;
