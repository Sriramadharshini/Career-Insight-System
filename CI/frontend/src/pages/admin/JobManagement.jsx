import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { adminApi } from '../../services/adminApi';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { toast } from 'react-hot-toast';
import { Plus, Building, MapPin, Clock, DollarSign, Target, Globe, Info, Briefcase } from 'lucide-react';
import { JobsHeroIllustration, EmptyStateIllustration } from '../../components/admin/AdminIllustrations';
import '../../styles/admin.css';

const emptyJob = { title: '', company: '', location: '', salaryRange: '', experience: '', skills: '', jobType: 'Full-time', applicationLink: '', description: '' };

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, limit: 10, search: '' });
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(emptyJob);
  const [isEditing, setIsEditing] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getJobs(params);
      setJobs(data.jobs);
      setTotalPages(data.pages);
    } catch (err) { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  }, [params]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleSearch = useCallback((query) => {
    setParams(prev => ({ ...prev, search: query, page: 1 }));
  }, []);

  const handleOpenModal = (job = null) => {
    if (job) {
      setCurrentJob({ ...job, skills: job.skills?.join(', ') || '' });
      setIsEditing(true);
    } else {
      setCurrentJob(emptyJob);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...currentJob, skills: currentJob.skills.split(',').map(s => s.trim()).filter(Boolean) };
    try {
      if (isEditing) await adminApi.updateJob(currentJob._id, payload);
      else await adminApi.createJob(payload);
      toast.success(isEditing ? 'Updated' : 'Created');
      setIsModalOpen(false);
      fetchJobs();
    } catch (err) { toast.error('Failed to save'); }
  };

  const toggleStatus = async (job) => {
    const newStatus = job.status === 'Active' ? 'Expired' : 'Active';
    try {
      await adminApi.updateJobStatus(job._id, newStatus);
      toast.success(`Marked as ${newStatus}`);
      fetchJobs();
    } catch (err) { toast.error('Failed to update status'); }
  };

  const confirmDelete = async () => {
    try {
      await adminApi.deleteJob(currentJob._id);
      toast.success('Deleted');
      fetchJobs();
    } catch (err) { toast.error('Failed to delete'); }
  };

  const columns = useMemo(() => [
    { header: 'Title', cell: info => <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{info.row.original.title}</div> },
    { header: 'Company', cell: info => <div style={{ color: 'var(--text-muted)' }}>{info.row.original.company}</div> },
    { header: 'Type', cell: info => <div style={{ color: 'var(--text-muted)' }}>{info.row.original.jobType}</div> },
    { header: 'Status', cell: info => (
        <span className={`admin-status-badge ${info.row.original.status === 'Active' ? 'admin-status-active' : 'admin-status-blocked'}`}>
          {info.row.original.status}
        </span>
    )},
    {
      header: 'Actions',
      cell: info => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => toggleStatus(info.row.original)} className="admin-button-link admin-button" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>{info.row.original.status === 'Active' ? 'Expire' : 'Activate'}</button>
          <button onClick={() => handleOpenModal(info.row.original)} className="admin-button" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>Edit</button>
          <button onClick={() => { setCurrentJob(info.row.original); setIsDeleteOpen(true); }} className="admin-button danger" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', boxShadow: 'none' }}>Delete</button>
        </div>
      )
    }
  ], []);

  return (
    <div className="page-container page-fade-in">
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <h2 className="admin-page-title">Job Postings</h2>
            <p className="admin-page-subtitle">Manage all available job postings.</p>
          </div>
          <div style={{ width: '180px' }}>
            <JobsHeroIllustration />
          </div>
        </div>
        <button onClick={() => handleOpenModal()} className="admin-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={16} /> Add Job</button>
      </div>
      <div className="admin-card">
        <div className="admin-search-container">
          <SearchBar onSearch={handleSearch} placeholder="Search jobs or companies..." />
        </div>
        <div className="admin-table-container">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : jobs.length === 0 ? (
            <div className="admin-empty-state">
              <EmptyStateIllustration color="orange" />
              <p className="admin-empty-text">No job postings found.</p>
            </div>
          ) : (
            <><DataTable data={jobs} columns={columns} /><Pagination currentPage={params.page} totalPages={totalPages} onPageChange={p => setParams({...params, page: p})} /></>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${isEditing ? 'Edit' : 'Add'} Job Posting`}>
        <div className="admin-creation-container">
          <div className="creation-info-panel">
            <div className="creation-visual-box">
              <JobsHeroIllustration />
            </div>
            <div className="creation-help-card">
              <h4><Info size={16} style={{ marginBottom: '-3px', marginRight: '8px' }} /> Visibility</h4>
              <p>Active jobs are immediately visible to all eligible candidates. Ensure the application link is valid.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="admin-form-hero">
            <div className="admin-section-divider">
              <span>Job Details</span>
            </div>

            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-label">Job Title</label>
                <div className="admin-input-group">
                  <Briefcase className="admin-input-icon" size={18} />
                  <input required value={currentJob.title} onChange={e=>setCurrentJob({...currentJob, title: e.target.value})} className="admin-input admin-input-with-icon" placeholder="e.g. Senior Software Engineer" />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Company Name</label>
                <div className="admin-input-group">
                  <Building className="admin-input-icon" size={18} />
                  <input required value={currentJob.company} onChange={e=>setCurrentJob({...currentJob, company: e.target.value})} className="admin-input admin-input-with-icon" placeholder="e.g. TechCorp Solutions" />
                </div>
              </div>
            </div>

            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-label">Job Type</label>
                <div className="admin-input-group">
                  <Clock className="admin-input-icon" size={18} />
                  <select value={currentJob.jobType} onChange={e=>setCurrentJob({...currentJob, jobType: e.target.value})} className="admin-input admin-input-with-icon">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Location</label>
                <div className="admin-input-group">
                  <MapPin className="admin-input-icon" size={18} />
                  <input value={currentJob.location} onChange={e=>setCurrentJob({...currentJob, location: e.target.value})} className="admin-input admin-input-with-icon" placeholder="e.g. San Francisco, CA" />
                </div>
              </div>
            </div>

            <div className="admin-section-divider">
              <span>Requirements & Link</span>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Required Skills (comma separated)</label>
              <div className="admin-input-group">
                <Target className="admin-input-icon" size={18} />
                <input value={currentJob.skills} onChange={e=>setCurrentJob({...currentJob, skills: e.target.value})} className="admin-input admin-input-with-icon" placeholder="e.g. React, Node.js, AWS" />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Application Link</label>
              <div className="admin-input-group">
                <Globe className="admin-input-icon" size={18} />
                <input required value={currentJob.applicationLink} onChange={e=>setCurrentJob({...currentJob, applicationLink: e.target.value})} className="admin-input admin-input-with-icon" placeholder="https://careers.company.com/job/123" />
              </div>
            </div>

            <div className="admin-action-row">
              <button type="button" onClick={() => setIsModalOpen(false)} className="admin-button-link admin-button">Cancel</button>
              <button type="submit" className="admin-button success">Post Job</button>
            </div>
          </form>
        </div>
      </Modal>

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete} title="Delete Job" message="Are you sure?" confirmText="Delete" isDestructive={true} />
    </div>
  );
};

export default JobManagement;
