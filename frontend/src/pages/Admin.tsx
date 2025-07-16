import React, { useEffect, useState, useCallback } from 'react';
import { Users, Edit, Trash2, Save, X, Eye, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { RootState } from '../store';
import { useSelector } from 'react-redux';
import { fetchAllUsers, updateUser, deleteUser } from '../store/slices/usersSlice';
import { fetchUserPrompts } from '../store/slices/promptsSlice';
import { useAppDispatch } from '../store';
import Layout from '../components/Layout';
import { useForm } from 'react-hook-form';

interface EditUserForm {
  name: string;
  phone: string;
  role: 'USER' | 'ADMIN';
}

interface Prompt {
  id: number;
  createdAt: string;
  prompt: string;
  response: string;
}

const Admin: React.FC = () => {
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [viewingUserPrompts, setViewingUserPrompts] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return 'N/A';
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and monitor platform activity.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Users Management</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={filterRole}
                onChange={handleFilterChange}
                className="w-full sm:w-auto pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm"
            >
              Apply Filters
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">Loading users...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">No users found matching your criteria.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingUser === user.id ? (
                          <div className="space-y-2">
                            <input
                              {...register('name', { required: 'Name is required' })}
                              className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            <input
                              {...register('phone', { required: 'Phone is required' })}
                              className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingUser === user.id ? (
                          <select
                            {...register('role')}
                            className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                          >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        ) : (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                            {user.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {editingUser === user.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSubmit(handleSave)}
                              className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-gray-100 transition-colors"
                              title="Save"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100 transition-colors"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewPrompts(user.id)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-gray-100 transition-colors"
                              title="View Prompts"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(user)}
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-gray-100 transition-colors"
                              title="Edit User"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(user.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-gray-100 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalUsers > 0 && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages} ({totalUsers} users)
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          )}
        </div>

        {viewingUserPrompts && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-xl">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    User Prompts - {users.find(u => u.id === viewingUserPrompts)?.name}
                  </h3>
                  <button
                    onClick={() => setViewingUserPrompts(null)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                {promptsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : prompts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No prompts found for this user.</p>
                ) : (
                  <div className="space-y-4">
                    {prompts.map((prompt: Prompt) => (
                      <div key={prompt.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="text-sm text-gray-500 mb-2">
                          {formatDate(prompt.createdAt)}
                        </div>
                        <div className="space-y-2">
                          <div>
                            <strong className="text-gray-900">Question:</strong>
                            <p className="text-gray-700 text-sm">{prompt.prompt}</p>
                          </div>
                          <div>
                            <strong className="text-gray-900">Response:</strong>
                            <p className="text-gray-700 text-sm whitespace-pre-wrap">{prompt.response}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;
