import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { loginUser, clearUserNotFound, clearError } from '../store/slices/authSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Layout from '../components/Layout';
import { Eye, EyeOff, LogIn } from 'lucide-react';

interface LoginForm {
  phone: string;
  password: string;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user, userNotFound } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    console.log('Login.tsx - useEffect [user]: user state is', user);
    if (user) {
      console.log('Login.tsx - User found, navigating to /dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    console.log('Login.tsx - useEffect [userNotFound]: userNotFound is', userNotFound);
    if (userNotFound) {
      console.log('Login.tsx - User not found, navigating to /register');
      // Optional: provide a brief message to the user before redirecting
      // For production, consider a custom modal or toast notification instead of alert.
      // alert('User not found. Please register.');
      dispatch(clearUserNotFound()); // Clear the flag to prevent re-redirects
      navigate('/register');
    }
  }, [userNotFound, navigate, dispatch]);

  // Clear any previous errors when the component mounts or if the error state changes
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data: LoginForm) => {
    try {
      console.log('Login.tsx - Attempting login with data:', data.phone);
      // Dispatch the loginUser async thunk
      await dispatch(loginUser(data)).unwrap();
      // Redirection to dashboard is handled by the first useEffect if login is successful
    } catch (err) {
      // Error handling for other login failures (e.g., invalid password)
      // The 'error' state in authSlice will be updated and displayed by the UI.
      console.error('Login submission error:', err);
    }
  };

  return (
    <Layout>
      {/* Applied consistent background gradient and padding from Register.tsx */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        {/* Applied consistent max-width and spacing from Register.tsx */}
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  id="phone"
                  {...register('phone', { required: 'Phone is required' })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message as string}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    {...register('password', { required: 'Password is required' })}
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message as string}</p>}
              </div>
              {/* Display generic errors, but not 'user not found' here as it triggers a redirect */}
              {error && !userNotFound && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </>
                )}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
