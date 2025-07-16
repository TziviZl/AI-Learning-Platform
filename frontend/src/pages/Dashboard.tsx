import React, { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Send, BookOpen, MessageSquare } from 'lucide-react';
import { RootState } from '../store';
import { fetchCategories, fetchSubCategories, clearSubCategories } from '../store/slices/categoriesSlice';
import { submitPrompt, clearCurrentResponse } from '../store/slices/promptsSlice';
import Layout from '../components/Layout';

interface PromptForm {
    categoryId: number;
    subCategoryId: number;
    promptText: string;
}

const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { categories, subCategories, loading: categoriesLoading } = useSelector((state: RootState) => state.categories);
    const { currentResponse, lastPromptText, loading: promptLoading } = useSelector((state: RootState) => state.prompts);

    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<PromptForm>();
    const selectedCategory = watch('categoryId');

    useEffect(() => {
        dispatch(fetchCategories());
        return () => {
            dispatch(clearCurrentResponse());
        };
    }, [dispatch]);

    useEffect(() => {
        if (selectedCategory) {
            dispatch(fetchSubCategories(selectedCategory));
        } else {
            dispatch(clearSubCategories());
        }
    }, [selectedCategory, dispatch]);

    const onSubmit = async (data: PromptForm) => {
        if (!user) return;

        try {
            await dispatch(submitPrompt({
                userId: user.id,
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
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.name}!
                    </h1>
                    <p className="text-gray-600">
                        Select a category and ask your question to get personalized AI-generated lessons.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-2 mb-6">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Create New Learning Session</h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Category
                                </label>
                                <select
                                    {...register('categoryId', { required: 'Please select a category' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    disabled={categoriesLoading}
                                >
                                    <option value="">Choose a category...</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.categoryId && (
                                    <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="subCategoryId" className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Sub-Category
                                </label>
                                <select
                                    {...register('subCategoryId', { required: 'Please select a sub-category' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    disabled={!selectedCategory || categoriesLoading}
                                >
                                    <option value="">Choose a sub-category...</option>
                                    {subCategories.map((subCategory) => (
                                        <option key={subCategory.id} value={subCategory.id}>
                                            {subCategory.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.subCategoryId && (
                                    <p className="mt-1 text-sm text-red-600">{errors.subCategoryId.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="promptText" className="block text-sm font-medium text-gray-700 mb-2">
                                Your Question or Topic
                            </label>
                            <textarea
                                {...register('promptText', { required: 'Please enter your question or topic' })}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="What would you like to learn about?"
                            />
                            {errors.promptText && (
                                <p className="mt-1 text-sm text-red-600">{errors.promptText.message}</p>
                            )}
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

                {(currentResponse || lastPromptText) && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <MessageSquare className="h-6 w-6 text-green-600" />
                            <h3 className="text-xl font-semibold text-gray-900">AI-Generated Lesson</h3>
                        </div>
                        <div className="prose max-w-none">
                            {lastPromptText && (
                                <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-200 text-blue-800 rounded-md">
                                    <p className="font-semibold text-blue-900 mb-1">Your Question:</p>
                                    <p className="whitespace-pre-wrap">{lastPromptText}</p>
                                </div>
                            )}

                            {currentResponse && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="font-semibold text-gray-900 mb-1">AI Response:</p>
                                    <p className="text-gray-800 whitespace-pre-wrap">{currentResponse}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default Dashboard;