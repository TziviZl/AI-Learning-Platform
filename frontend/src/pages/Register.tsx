import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, FormProvider } from 'react-hook-form';
import { RootState, AppDispatch } from '../store';
import { clearError } from '../store/slices/auth/authSlice';
import { registerUser } from '../store/slices/auth/authThunks';
import Layout from '../components/Layout';
import RegisterFormInputs from '../components/Register/RegisterFormInputs';
import ErrorMessage from '../components/Register/ErrorMessage';
import SubmitButton from '../components/Register/SubmitButton';

interface RegisterForm {
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, token, user } = useSelector((state: RootState) => state.auth);

  const methods = useForm<RegisterForm>();
  const { handleSubmit, watch } = methods;
  const password = watch('password');

  useEffect(() => {
    if (token && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, user, navigate]);

  const onSubmit = async (data: RegisterForm) => {
    try {
      await dispatch(registerUser({
        name: data.name,
        phone: data.phone,
        password: data.password,
      })).unwrap();
    } catch (err) {
      console.error('Register submission error:', err);
    }
  };

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-500">Sign in</Link>
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <RegisterFormInputs
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                  passwordValue={password}
                />
                <ErrorMessage error={error} />
                <SubmitButton loading={loading} />
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
