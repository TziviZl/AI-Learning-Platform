import React from 'react';
import { Edit, Trash2, Save, X, Eye, ChevronLeft, ChevronRight, Search, Filter, Users } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface User {
  id: number;
  name: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

interface EditUserForm {
  name: string;
  phone: string;
  role: 'USER' | 'ADMIN';
}

interface UserTableProps {
  users: User[];
  loading: boolean;
  editingUser: number | null;
  onEdit: (user: User) => void;
  onCancelEdit: () => void;
  onSave: React.FormEventHandler<HTMLFormElement>;  // שימו לב: סוג הפונקציה מתאים ל-onSubmit של form
  register: UseFormRegister<EditUserForm>;
  errors: FieldErrors<EditUserForm>;
  onViewPrompts: (userId: number) => void;
  onShowDeleteConfirm: (userId: number) => void;
  currentPage: number;
  totalUsers: number;
  itemsPerPage: number;
  onPageChange: (newPage: number) => void;
  filterRole: 'user' | 'admin' | '';
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyFilters: () => void;
  formatDate: (dateString?: string) => string;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  editingUser,
  onEdit,
  onCancelEdit,
  onSave,
  register,
  errors,
  onViewPrompts,
  onShowDeleteConfirm,
  currentPage,
  totalUsers,
  itemsPerPage,
  onPageChange,
  filterRole,
  onFilterChange,
  searchTerm,
  onSearchChange,
  onApplyFilters,
  formatDate,
}) => {
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  return (
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
            onChange={onSearchChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={filterRole}
            onChange={onFilterChange}
            className="w-full sm:w-auto pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          onClick={onApplyFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm"
        >
          Apply Filters
        </button>
      </div>

      <form onSubmit={onSave}>
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
                            type="submit"
                            className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            title="Save"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={onCancelEdit}
                            className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => onViewPrompts(user.id)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            title="View Prompts"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEdit(user)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onShowDeleteConfirm(user.id)}
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
      </form>

      {totalUsers > 0 && (
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages} ({totalUsers} users)
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserTable;
