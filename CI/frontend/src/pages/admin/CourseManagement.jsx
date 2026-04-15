import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { adminApi } from '../../services/adminApi';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { toast } from 'react-hot-toast';
import { Plus, BookOpen, Monitor, BarChart, Link as LinkIcon, Info, Tag, Layers } from 'lucide-react';
import { CoursesHeroIllustration, EmptyStateIllustration } from '../../components/admin/AdminIllustrations';
import '../../styles/admin.css';


const emptyCourse = { name: '', platform: 'Other', url: '', price: 'Free', skillLevel: 'Beginner', description: '' };

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, limit: 10, search: '' });
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(emptyCourse);
  const [isEditing, setIsEditing] = useState(false);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getCourses(params);
      setCourses(data.courses);
      setTotalPages(data.pages);
    } catch (err) { toast.error('Failed to load courses'); }
    finally { setLoading(false); }
  }, [params]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handleSearch = useCallback((query) => {
    setParams(prev => ({ ...prev, search: query, page: 1 }));
  }, []);

  const handleOpenModal = (course = null) => {
    if (course) { setCurrentCourse(course); setIsEditing(true); } 
    else { setCurrentCourse(emptyCourse); setIsEditing(false); }
    setIsModalOpen(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) await adminApi.updateCourse(currentCourse._id, currentCourse);
      else await adminApi.createCourse(currentCourse);
      toast.success(isEditing ? 'Updated' : 'Created');
      setIsModalOpen(false);
      fetchCourses();
    } catch (err) { toast.error('Failed to save'); }
  };

  const toggleFeatured = async (course) => {
    try {
      await adminApi.updateCourseFeatured(course._id, !course.featured);
      toast.success(course.featured ? 'Removed from featured' : 'Marked as featured');
      fetchCourses();
    } catch (err) { toast.error('Failed to update featured'); }
  };

  const confirmDelete = async () => {
    try {
      await adminApi.deleteCourse(currentCourse._id);
      toast.success('Deleted');
      fetchCourses();
    } catch (err) { toast.error('Failed to delete'); }
  };

  const columns = useMemo(() => [
    { header: 'Name', cell: info => <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{info.row.original.name}</div> },
    { header: 'Platform', cell: info => <div style={{ color: 'var(--text-muted)' }}>{info.row.original.platform}</div> },
    { header: 'Level', cell: info => <div style={{ color: 'var(--text-muted)' }}>{info.row.original.skillLevel}</div> },
    { header: 'Featured', cell: info => <span className={`admin-status-badge ${info.row.original.featured ? 'admin-status-active' : ''}`}>{info.row.original.featured ? 'Yes' : 'No'}</span> },
    {
      header: 'Actions',
      cell: info => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => toggleFeatured(info.row.original)} className="admin-button-link admin-button" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>{info.row.original.featured ? 'Unfeature' : 'Feature'}</button>
          <button onClick={() => handleOpenModal(info.row.original)} className="admin-button" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>Edit</button>
          <button onClick={() => { setCurrentCourse(info.row.original); setIsDeleteOpen(true); }} className="admin-button danger" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', boxShadow: 'none' }}>Delete</button>
        </div>
      )
    }
  ], []);

  return (
    <div className="page-container page-fade-in">
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <h2 className="admin-page-title">Courses</h2>
            <p className="admin-page-subtitle">Manage learning resources and courses.</p>
          </div>
          <div style={{ width: '180px' }}>
            <CoursesHeroIllustration />
          </div>
        </div>
        <button onClick={() => handleOpenModal()} className="admin-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={16} /> Add Course</button>
      </div>
      <div className="admin-card">
        <div className="admin-search-container">
          <SearchBar onSearch={handleSearch} placeholder="Search courses or platforms..." />
        </div>
        <div className="admin-table-container">

          {loading ? (
            <div className="loading-spinner"></div>
          ) : courses.length === 0 ? (
            <div className="admin-empty-state">
              <EmptyStateIllustration color="blue" />
              <p className="admin-empty-text">No courses found.</p>
            </div>
          ) : (
            <><DataTable data={courses} columns={columns} /><Pagination currentPage={params.page} totalPages={totalPages} onPageChange={p => setParams({...params, page: p})} /></>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${isEditing ? 'Edit' : 'Add'} Course`}>
        <div className="admin-creation-container">
          <div className="creation-info-panel">
            <div className="creation-visual-box">
              <CoursesHeroIllustration />
            </div>
            <div className="creation-help-card">
              <h4><Info size={16} style={{ marginBottom: '-3px', marginRight: '8px' }} /> Engagement</h4>
              <p>Featured courses appear at the top of recommendations. High-quality cover images and clear names improve CTR.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="admin-form-hero">
            <div className="admin-section-divider">
              <span>Main Curriculum</span>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Course / Resource Name</label>
              <div className="admin-input-group">
                <BookOpen className="admin-input-icon" size={18} />
                <input required value={currentCourse.name} onChange={e=>setCurrentCourse({...currentCourse, name: e.target.value})} className="admin-input admin-input-with-icon" placeholder="e.g. Master Modern React (2026)" />
              </div>
            </div>

            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-label">Platform</label>
                <div className="admin-input-group">
                  <Monitor className="admin-input-icon" size={18} />
                  <select value={currentCourse.platform} onChange={e=>setCurrentCourse({...currentCourse, platform: e.target.value})} className="admin-input admin-input-with-icon">
                    <option value="Udemy">Udemy</option>
                    <option value="Coursera">Coursera</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Pluralsight">Pluralsight</option>
                    <option value="LinkedIn Learning">LinkedIn Learning</option>
                    <option value="Other">Other Platform</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Skill Level</label>
                <div className="admin-input-group">
                  <BarChart className="admin-input-icon" size={18} />
                  <select value={currentCourse.skillLevel} onChange={e=>setCurrentCourse({...currentCourse, skillLevel: e.target.value})} className="admin-input admin-input-with-icon">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="admin-section-divider">
              <span>Access & Pricing</span>
            </div>

            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-label">Course URL</label>
                <div className="admin-input-group">
                  <LinkIcon className="admin-input-icon" size={18} />
                  <input required value={currentCourse.url} onChange={e=>setCurrentCourse({...currentCourse, url: e.target.value})} className="admin-input admin-input-with-icon" placeholder="https://www.udemy.com/course/..." />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Price / Access Type</label>
                <div className="admin-input-group">
                  <Tag className="admin-input-icon" size={18} />
                  <input value={currentCourse.price} onChange={e=>setCurrentCourse({...currentCourse, price: e.target.value})} className="admin-input admin-input-with-icon" placeholder="e.g. $19.99 or Free" />
                </div>
              </div>
            </div>

            <div className="admin-section-divider">
              <span>Categorization</span>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Short Description</label>
              <textarea rows="3" value={currentCourse.description} onChange={e=>setCurrentCourse({...currentCourse, description: e.target.value})} className="admin-input" placeholder="Briefly explain what this course covers..." />
            </div>

            <div className="admin-action-row">
              <button type="button" onClick={() => setIsModalOpen(false)} className="admin-button-link admin-button">Cancel</button>
              <button type="submit" className="admin-button success">Save Course</button>
            </div>
          </form>
        </div>
      </Modal>
      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete} title="Delete Course" message="Are you sure?" confirmText="Delete" isDestructive={true} />
    </div>
  );
};

export default CourseManagement;
