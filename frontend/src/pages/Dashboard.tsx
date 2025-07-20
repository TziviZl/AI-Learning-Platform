import React, { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {  clearSubCategories } from '../store/slices/categories/categoriesSlice';
import { fetchCategories } from '../store/slices/categories/categoriesThunks';
import { clearCurrentResponse } from '../store/slices/prompts/promptsSlice';
import Layout from '../components/Layout';
import PromptForm from '../components/Dashboard/PromptForm';
import ResponseDisplay from '../components/Dashboard/ResponseDisplay';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { categories, subCategories, loading: categoriesLoading } = useSelector((state: RootState) => state.categories);
  const { currentResponse, lastPromptText, loading: promptLoading } = useSelector((state: RootState) => state.prompts);

  useEffect(() => {
    dispatch(fetchCategories());
    return () => {
      dispatch(clearCurrentResponse());
    };
  }, [dispatch]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">
            Select a category and ask your question to get personalized AI-generated lessons.
          </p>
        </div>

        <PromptForm
          categories={categories}
          subCategories={subCategories}
          categoriesLoading={categoriesLoading}
          promptLoading={promptLoading}
          userId={user?.id}
        />

        {(currentResponse || lastPromptText) && (
          <ResponseDisplay currentResponse={currentResponse} lastPromptText={lastPromptText} />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
