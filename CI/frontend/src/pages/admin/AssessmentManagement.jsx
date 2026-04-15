import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { adminApi } from '../../services/adminApi';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, HelpCircle, Layers, Award, Info, ListChecks } from 'lucide-react';
import { AssessmentsHeroIllustration, EmptyStateIllustration } from '../../components/admin/AdminIllustrations';
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <h2 className="admin-page-title">Assessments</h2>
            <p className="admin-page-subtitle">Manage platform skill and behavior assessments.</p>
          </div>
          <div style={{ width: '180px' }}>
            <AssessmentsHeroIllustration />
          </div>
        </div>
        <button onClick={() => handleOpenModal()} className="admin-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={16} /> Add Assessment</button>
      </div>

      <div className="admin-card">
        <div className="admin-search-container">
          <div style={{ maxWidth: '300px', flex: 1 }}>
            <select value={params.category} onChange={handleFilter} className="admin-input">
              <option value="">All Categories</option>
              <option value="Technical Skills">Technical Skills</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="Interest Areas">Interest Areas</option>
              <option value="Work Style">Work Style</option>
            </select>
          </div>
        </div>

        <div className="admin-table-container">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : assessments.length === 0 ? (
            <div className="admin-empty-state">
              <EmptyStateIllustration color="orange" />
              <p className="admin-empty-text">No assessments found.</p>
            </div>
          ) : (
            <><DataTable data={assessments} columns={columns} /><Pagination currentPage={params.page} totalPages={totalPages} onPageChange={handlePageChange} /></>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${isEditing ? 'Edit' : 'Add'} Question`}>
        <div className="admin-creation-container">
          <div className="creation-info-panel">
            <div className="creation-visual-box">
              <AssessmentsHeroIllustration />
            </div>
            <div className="creation-help-card">
              <h4><Info size={16} style={{ marginBottom: '-3px', marginRight: '8px' }} /> Question Design</h4>
              <p>Assign weightages accurately. Higher weightages mean the answer has a stronger influence on career matching.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="admin-form-hero">
            <div className="admin-section-divider">
              <span>Question Content</span>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Question Text</label>
              <div className="admin-input-group">
                <HelpCircle className="admin-input-icon" size={18} />
                <textarea required rows="2" value={currentItem.questionText} onChange={e=>setCurrentItem({...currentItem, questionText: e.target.value})} className="admin-input admin-input-with-icon" placeholder="e.g. How comfortable are you with complex problem solving?" />
              </div>
            </div>

            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-label">Category</label>
                <div className="admin-input-group">
                  <Layers className="admin-input-icon" size={18} />
                  <select value={currentItem.category} onChange={e=>setCurrentItem({...currentItem, category: e.target.value})} className="admin-input admin-input-with-icon">
                    <option value="Technical Skills">Technical Skills</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Interest Areas">Interest Areas</option>
                    <option value="Work Style">Work Style</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="admin-section-divider">
              <span>Options & Scoring</span>
            </div>

            <div className="admin-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <label className="admin-label" style={{ marginBottom: 0 }}>Define Possible Answers</label>
                <button type="button" onClick={addOption} className="admin-button-link admin-button" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>+ Add Choice</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {currentItem.options.map((opt, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
                    <div className="admin-input-group" style={{ flex: 1 }}>
                      <ListChecks className="admin-input-icon" size={16} />
                      <input required placeholder="Option text" value={opt.text} onChange={e=>updateOption(idx, 'text', e.target.value)} className="admin-input admin-input-with-icon" />
                    </div>
                    <div className="admin-input-group" style={{ width: '100px' }}>
                      <Award className="admin-input-icon" size={16} />
                      <input required type="number" placeholder="Wt." value={opt.weightage} onChange={e=>updateOption(idx, 'weightage', e.target.value)} className="admin-input admin-input-with-icon" />
                    </div>
                    <button type="button" onClick={() => removeOption(idx)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.6rem', borderRadius: '8px' }}><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-section-divider">
              <span>Career Correlation</span>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Related Career Paths (comma separated)</label>
              <input placeholder="Software Engineer, Data Scientist" value={currentItem.relatedCareers} onChange={e=>setCurrentItem({...currentItem, relatedCareers: e.target.value})} className="admin-input" />
            </div>

            <div className="admin-action-row">
              <button type="button" onClick={() => setIsModalOpen(false)} className="admin-button-link admin-button">Cancel</button>
              <button type="submit" className="admin-button success">Save Question</button>
            </div>
          </form>
        </div>
      </Modal>

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete} title="Delete Question" message="Are you sure you want to delete this question? This cannot be undone." confirmText="Delete" isDestructive={true} />
    </div>
  );
};

export default AssessmentManagement;
