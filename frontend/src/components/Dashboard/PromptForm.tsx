import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../store';
import { clearSubCategories } from '../../store/slices/categories/categoriesSlice';
import { fetchSubCategories } from '../../store/slices/categories/categoriesThunks'
import { submitPrompt } from '../../store/slices/prompts/promptsThunks';
import { Send, BookOpen } from 'lucide-react';

interface PromptFormProps {
  categories: { id: number; name: string }[];
  subCategories: { id: number; name: string }[];
  categoriesLoading: boolean;
  promptLoading: boolean;
  userId?: number;
}

interface PromptFormData {
  categoryId: number;
  subCategoryId: number;
  promptText: string;
}

const PromptForm: React.FC<PromptFormProps> = ({
  categories,
  subCategories,
  categoriesLoading,
  promptLoading,
  userId,
}) => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<PromptFormData>();
  const selectedCategory = watch('categoryId');

  useEffect(() => {
    if (selectedCategory) {
      dispatch(fetchSubCategories(selectedCategory));
    } else {
      dispatch(clearSubCategories());
    }
  }, [selectedCategory, dispatch]);

  const onSubmit = async (data: PromptFormData) => {
    if (!userId) return;
    try {
      await dispatch(submitPrompt({
        userId,
        categoryId: Number(data.categoryId),
        subCategoryId: Number(data.subCategoryId),
        promptText: data.promptText,
      })).unwrap();
      reset();
    } catch (error) {
      console.error('Error during submit:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <BookOpen className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Create New Learning Session</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
            <select
              {...register('categoryId', { required: 'Please select a category' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={categoriesLoading}
            >
              <option value="">Choose a category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
          </div>

          <div>
            <label htmlFor="subCategoryId" className="block text-sm font-medium text-gray-700 mb-2">Select Sub-Category</label>
            <select
              {...register('subCategoryId', { required: 'Please select a sub-category' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={!selectedCategory || categoriesLoading}
            >
              <option value="">Choose a sub-category...</option>
              {subCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
            {errors.subCategoryId && <p className="mt-1 text-sm text-red-600">{errors.subCategoryId.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="promptText" className="block text-sm font-medium text-gray-700 mb-2">Your Question or Topic</label>
          <textarea
            {...register('promptText', { required: 'Please enter your question or topic' })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="What would you like to learn about?"
          />
          {errors.promptText && <p className="mt-1 text-sm text-red-600">{errors.promptText.message}</p>}
        </div>

        <button
          type="submit"
          disabled={promptLoading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {promptLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Generate Lesson
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PromptForm;
