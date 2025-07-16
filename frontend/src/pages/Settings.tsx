import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Keep useSelector from react-redux
import { useForm } from 'react-hook-form';
import { Save, Eye, EyeOff, User, Lock } from 'lucide-react';
import { RootState, useAppDispatch } from '../store'; // Import useAppDispatch from your store
import { updateProfile, UserUpdatePayload } from '../store/slices/authSlice';
import Layout from '../components/Layout';

interface ProfileForm {
  name: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data: ProfileForm) => {
    setErrorMessage(null);
    setUpdateSuccess(false);

    try {
      const payloadForBackend: UserUpdatePayload = {};

      if (data.name !== user?.name && data.name.trim() !== '') {
        payloadForBackend.name = data.name;
      }

      if (data.newPassword) {
        if (!data.currentPassword) {
            setErrorMessage("Current password is required to change password.");
            return;
        }
        payloadForBackend.currentPassword = data.currentPassword;
        payloadForBackend.newPassword = data.newPassword;
      }

      if (Object.keys(payloadForBackend).length === 0) {
        setErrorMessage("No changes to save.");
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }

      // TypeScript will now correctly understand the return type of updateProfile
      const resultAction = await dispatch(updateProfile(payloadForBackend)).unwrap();
      if (resultAction) {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);

        reset({
          name: data.name,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error: any) {
      console.error("Update failed:", error);
      setErrorMessage(error || "An unexpected error occurred.");
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">
            Manage your account information and preferences.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <User className="h-4 w-4 inline mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'password' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <Lock className="h-4 w-4 inline mr-2" />
                Password
              </button>
            </nav>
          </div>

          <div className="p-6">
            {updateSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600">Profile updated successfully!</p>
              </div>
            )}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      value={user?.phone || ''}
                      disabled
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">Phone number cannot be changed</p>
                  </div>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                    <div className="relative mt-1">
                      <input
                        {...register('currentPassword', { required: newPassword ? 'Current password is required to change password' : false })}
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                      </button>
                    </div>
                    {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative mt-1">
                      <input
                        {...register('newPassword', { minLength: newPassword ? { value: 6, message: 'Password must be at least 6 characters' } : undefined })}
                        type={showNewPassword ? 'text' : 'password'}
                        className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                      </button>
                    </div>
                    {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <div className="relative mt-1">
                      <input
                        {...register('confirmPassword', {
                          validate: (value) => {
                            if (newPassword && !value) return 'Please confirm your new password';
                            if (newPassword && value !== newPassword) return 'Passwords do not match';
                            return true;
                          }
                        })}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> : <Save className="h-4 w-4 mr-2" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;