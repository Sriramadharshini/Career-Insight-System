import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { adminApi } from '../../services/adminApi';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { toast } from 'react-hot-toast';
import { UsersHeroIllustration, EmptyStateIllustration } from '../../components/admin/AdminIllustrations';
import '../../styles/admin.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, limit: 10, search: '', status: '' });
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBlockOpen, setIsBlockOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getUsers(params);
      setUsers(data.users || []);
      setTotalPages(data.pages || 1);
      setTotalUsers(data.total || 0);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [params.page, params.limit, params.search, params.status]); // Depend on values, not the object

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 100); // Small debounce to prevent rapid re-fetching
    return () => clearTimeout(timer);
  }, [fetchUsers]);


  const handleSearch = useCallback((query) => {
    setParams(prev => ({ ...prev, search: query, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setParams(prev => ({ ...prev, page }));
  }, []);

  const handleFilterStatus = useCallback((e) => {
    const status = e.target.value;
    setParams(prev => ({ ...prev, status, page: 1 }));
  }, []);

  const confirmBlockToggle = async () => {
    if (!selectedUser) return;
    const newStatus = selectedUser.status === 'Active' ? 'Blocked' : 'Active';
    try {
      await adminApi.updateUserStatus(selectedUser._id, newStatus);
      toast.success(`User has been ${newStatus.toLowerCase()}`);
      fetchUsers();
    } catch (err) {
      toast.error(`Failed to update status`);
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await adminApi.deleteUser(selectedUser._id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleExport = () => {
    if (users.length === 0) return toast.error("No users to export");
    const headers = ["Name,Email,Status,Joined Date"];
    const rows = users.map(u => `${u.name},${u.email},${u.status},${new Date(u.createdAt).toLocaleDateString()}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = useMemo(() => [
    { header: 'Name', cell: info => <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{info.row.original.name}</div> },
    { header: 'Email', cell: info => <div style={{ color: 'var(--text-muted)' }}>{info.row.original.email}</div> },
    { 
      header: 'Status', 
      cell: info => {
        const val = info.row.original.status;
        return (
          <span className={`admin-status-badge ${val === 'Active' ? 'admin-status-active' : 'admin-status-blocked'}`}>
            {val}
          </span>
        );
      } 
    },
    { header: 'Joined date', cell: info => new Date(info.row.original.createdAt).toLocaleDateString() },
    {
      header: 'Actions',
      cell: info => {
        const user = info.row.original;
        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => { setSelectedUser(user); setIsBlockOpen(true); }}
              className={`admin-button ${user.status === 'Active' ? 'danger' : 'success'}`}
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            >
              {user.status === 'Active' ? 'Block' : 'Unblock'}
            </button>
            <button 
              onClick={() => { setSelectedUser(user); setIsDeleteOpen(true); }}
              className="admin-button danger"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', boxShadow: 'none' }}
            >
              Delete
            </button>
          </div>
        );
      }
    }
  ], []);

  return (
    <div className="page-container page-fade-in">
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <h2 className="admin-page-title">User Management</h2>
            <p className="admin-page-subtitle">Manage platform users, update statuses, and export data. ({totalUsers} total)</p>
          </div>
          <div style={{ width: '180px' }}>
            <UsersHeroIllustration />
          </div>
        </div>

        <button 
          onClick={handleExport}
          className="admin-button"
        >
          Export CSV
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-search-container">
          <SearchBar onSearch={handleSearch} placeholder="Search by name or email..." />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select 
              value={params.status} 
              onChange={handleFilterStatus}
              className="admin-input"
              style={{ width: '180px' }}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </div>



        <div className="admin-table-container">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : users.length === 0 ? (
            <div className="admin-empty-state">
              <EmptyStateIllustration color="green" />
              <p className="admin-empty-text">No users found matching your criteria.</p>
            </div>
          ) : (
            <>
              <DataTable data={users} columns={columns} />
              <Pagination currentPage={params.page} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </div>

      <ConfirmDialog 
        isOpen={isBlockOpen}
        onClose={() => setIsBlockOpen(false)}
        onConfirm={confirmBlockToggle}
        title={`${selectedUser?.status === 'Active' ? 'Block' : 'Unblock'} User`}
        message={`Are you sure you want to ${selectedUser?.status === 'Active' ? 'block' : 'unblock'} ${selectedUser?.name}?`}
        confirmText={selectedUser?.status === 'Active' ? 'Block User' : 'Unblock User'}
        isDestructive={selectedUser?.status === 'Active'}
      />

      <ConfirmDialog 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to permanently delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
};

export default UserManagement;
