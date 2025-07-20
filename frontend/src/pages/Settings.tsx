import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm, FormProvider } from 'react-hook-form';
import { RootState, useAppDispatch } from '../store';
import { updateProfile  } from '../store/slices/auth/authThunks';
import { UserUpdatePayload } from '../store/slices/auth/authTypes';
import Layout from '../components/Layout';
import ProfileTab from '../components/Settings/ProfileTab';
import PasswordTab from '../components/Settings/PasswordTab';
import SaveIcon from '../components/Settings/SaveIcon'; 

interface ProfileForm {
  name: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  const methods = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit, watch, reset } = methods;
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
          setErrorMessage('Current password is required to change password.');
          return;
        }
        payloadForBackend.currentPassword = data.currentPassword;
        payloadForBackend.newPassword = data.newPassword;
      }

      if (Object.keys(payloadForBackend).length === 0) {
        setErrorMessage('No changes to save.');
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }

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
      console.error('Update failed:', error);
      setErrorMessage(error|| 'An unexpected error occurred.');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'password'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
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

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                {activeTab === 'profile' && <ProfileTab user={user ?? undefined} errors={methods.formState.errors} />}
                {activeTab === 'password' && <PasswordTab newPassword={newPassword} errors={methods.formState.errors} />}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <SaveIcon className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
