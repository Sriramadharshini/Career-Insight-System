import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { adminApi } from '../../services/adminApi';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import { toast } from 'react-hot-toast';
import { MessageSquare, Star } from 'lucide-react';
import '../../styles/admin.css';
import feedbackIllustration from '../../assets/admin-illustrations/feedback.png';

const FeedbackSupport = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const [totalPages, setTotalPages] = useState(1);
  const [feedbackEnabled, setFeedbackEnabled] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getFeedback(params);
      setItems(data.feedbacks);
      setTotalPages(data.pages || 1);
      if (data.feedbackEnabled !== undefined) {
        setFeedbackEnabled(data.feedbackEnabled);
      }
    } catch (err) { 
      toast.error('Failed to load feedback'); 
    } finally { 
      setLoading(false); 
    }
  }, [params]);

  useEffect(() => { 
    fetchItems(); 
  }, [fetchItems]);

  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <Star 
            key={i} 
            size={14} 
            style={{ 
              color: i <= rating ? '#fbbf24' : '#3f3f46',
              fill: i <= rating ? '#fbbf24' : 'none'
            }} 
          />
        ))}
        <span style={{ marginLeft: '0.4rem', fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 600 }}>{rating}/5</span>
      </div>
    );
  };

  const columns = useMemo(() => [
    { 
      header: 'User', 
      cell: info => (
        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
          {info.row.original.user?.name || info.row.original.userName || 'Anonymous'}
        </div>
      )
    },
    { 
      header: 'Message', 
      cell: info => (
        <div style={{ color: 'var(--text-muted)', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {info.row.original.message}
        </div>
      )
    },
    { 
      header: 'Rating', 
      cell: info => renderStars(info.row.original.rating)
    }
  ], []);

  return (
    <div className="page-container page-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img src={feedbackIllustration} alt="Feedback Illustration" style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} />
          <div>
            <h2 className="admin-page-title" style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Feedback</h2>
            <p className="admin-page-subtitle" style={{ fontSize: '0.95rem' }}>User feedback and ratings.</p>
          </div>
        </div>
      </div>

      {!feedbackEnabled && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: '#ef4444',
            flexShrink: 0
          }}>
            <MessageSquare size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#fca5a5', fontWeight: 700 }}>Feedback Submissions Disabled</h4>
            <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#f87171', opacity: 0.9 }}>
              The system configuration has deactivated the user feedback portal. Normal users cannot submit new feedback, but existing historical feedback remains accessible below.
            </p>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-table-container">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
              <div className="loading-spinner"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="admin-empty-state">
              <MessageSquare size={48} style={{ color: '#5e5ce6', opacity: 0.3, marginBottom: '1rem' }} />
              <p className="admin-empty-text">No feedback received yet.</p>
            </div>
          ) : (
            <>
              <DataTable data={items} columns={columns} />
              <Pagination currentPage={params.page} totalPages={totalPages} onPageChange={p => setParams({...params, page: p})} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackSupport;
