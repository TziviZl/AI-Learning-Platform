import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { fetchAllUsers, updateUser, deleteUser } from '../store/slices/users/usersThunks';
import { fetchUserPrompts } from '../store/slices/prompts/promptsThunks';
import Layout from '../components/Layout';
import { useForm } from 'react-hook-form';

import UserTable from './../components/AdminDashboard/UserTable';
import UserPromptsModal from './../components/AdminDashboard/UserPromptsModal';
import DeleteUserModal from './../components/AdminDashboard/DeleteUserModal';
import { formatDate } from './../components/AdminDashboard/utils';

interface EditUserForm {
  name: string;
  phone: string;
  role: 'USER' | 'ADMIN';
}

const Admin: React.FC = () => {
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [viewingUserPrompts, setViewingUserPrompts] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterRole, setFilterRole] = useState<'user' | 'admin' | ''>('');
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useAppDispatch();
  const { users, loading, totalUsers } = useSelector((state: RootState) => state.users);
  const { prompts, loading: promptsLoading } = useSelector((state: RootState) => state.prompts);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EditUserForm>();

  const loadUsers = useCallback(() => {
    dispatch(fetchAllUsers({
      page: currentPage,
      limit: itemsPerPage,
      role: filterRole,
      search: searchTerm,
    }));
  }, [dispatch, currentPage, itemsPerPage, filterRole, searchTerm]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleEdit = (user: any) => {
    setEditingUser(user.id);
    reset({
      name: user.name,
      phone: user.phone,
      role: user.role,
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    reset();
  };

  const handleSave = async (data: EditUserForm) => {
    if (!editingUser) return;

    try {
      await dispatch(updateUser({
        id: editingUser,
        userData: data,
      })).unwrap();
      setEditingUser(null);
      reset();
      loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId: number | null) => {
    if (userId === null) return;
    try {
      await dispatch(deleteUser(userId)).unwrap();
      setShowDeleteConfirm(null);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleViewPrompts = (userId: number) => {
    setViewingUserPrompts(userId);
    dispatch(fetchUserPrompts(userId));
  };

  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterRole(e.target.value as 'user' | 'admin' | '');
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    loadUsers();
  };

  // כאן העטיפה שמותאמת ל-type של onSubmit בטופס
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(handleSave)();
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and monitor platform activity.</p>
        </div>

        <UserTable
          users={users}
          loading={loading}
          editingUser={editingUser}
          onEdit={handleEdit}
          onCancelEdit={handleCancelEdit}
          onSave={onSubmit} 
          register={register}
          errors={errors}
          onViewPrompts={handleViewPrompts}
          onShowDeleteConfirm={setShowDeleteConfirm}
          currentPage={currentPage}
          totalUsers={totalUsers}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          filterRole={filterRole}
          onFilterChange={handleFilterChange}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onApplyFilters={handleApplyFilters}
          formatDate={formatDate}
        />

        {viewingUserPrompts && (
          <UserPromptsModal
            user={users.find(u => u.id === viewingUserPrompts)!}
            prompts={prompts}
            loading={promptsLoading}
            onClose={() => setViewingUserPrompts(null)}
            formatDate={formatDate}
          />
        )}

        {showDeleteConfirm && (
          <DeleteUserModal
            onConfirm={() => handleDelete(showDeleteConfirm)}
            onCancel={() => setShowDeleteConfirm(null)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Admin;
