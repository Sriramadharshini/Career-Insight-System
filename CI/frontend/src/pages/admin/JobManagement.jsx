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

const emptyJob = { title: '', company: '', location: '', salaryRange: '', experience: '', skills: '', jobType: 'Full-time', applicationLink: '', description: '' };

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, limit: 10 });
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
        <div>
          <h2 className="admin-page-title">Job Postings</h2>
          <p className="admin-page-subtitle">Manage all available job postings.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="admin-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={16} /> Add Job</button>
      </div>
      <div className="admin-card">
        <div className="admin-table-container">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : jobs.length === 0 ? (
            <div className="admin-empty-state">
              <img src={emptyDataSvg} className="admin-empty-icon" alt="No data" />
              <p className="admin-empty-text">No job postings found.</p>
            </div>
          ) : (
            <><DataTable data={jobs} columns={columns} /><Pagination currentPage={params.page} totalPages={totalPages} onPageChange={p => setParams({...params, page: p})} /></>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${isEditing ? 'Edit' : 'Add'} Job`}>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Title</label>
              <input required value={currentJob.title} onChange={e=>setCurrentJob({...currentJob, title: e.target.value})} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Company</label>
              <input required value={currentJob.company} onChange={e=>setCurrentJob({...currentJob, company: e.target.value})} className="admin-input" />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Job Type</label>
              <select value={currentJob.jobType} onChange={e=>setCurrentJob({...currentJob, jobType: e.target.value})} className="admin-input">
                <option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Internship">Internship</option><option value="Remote">Remote</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Location</label>
              <input value={currentJob.location} onChange={e=>setCurrentJob({...currentJob, location: e.target.value})} className="admin-input" />
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Skills (comma separated)</label>
            <input value={currentJob.skills} onChange={e=>setCurrentJob({...currentJob, skills: e.target.value})} className="admin-input" />
          </div>
          <div className="admin-action-row">
            <button type="button" onClick={() => setIsModalOpen(false)} className="admin-button-link admin-button">Cancel</button>
            <button type="submit" className="admin-button success">Save</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete} title="Delete Job" message="Are you sure?" confirmText="Delete" isDestructive={true} />
    </div>
  );
};

export default JobManagement;
