import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { clearUserNotFound, clearError } from '../store/slices/auth/authSlice';
import { loginUser } from '../store/slices/auth/authThunks';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Layout from '../components/Layout';
import LoginFormComponent from '../components/Login/LoginFormComponent';

export interface LoginForm {
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
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  useEffect(() => {
    if (userNotFound) {
      dispatch(clearUserNotFound());
      navigate('/register');
    }
  }, [userNotFound, navigate, dispatch]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data: LoginForm) => {
    try {
      await dispatch(loginUser(data)).unwrap();
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <Layout>
      <LoginFormComponent
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        loading={loading}
        error={error}
        userNotFound={userNotFound}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
    </Layout>
  );
};

export default Login;
