import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Clock, BookOpen, MessageSquare } from 'lucide-react';
import { RootState, useAppDispatch } from '../store';
import { fetchUserPrompts } from '../store/slices/promptsSlice';
import Layout from '../components/Layout';

const History: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { prompts, loading } = useSelector((state: RootState) => state.prompts);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserPrompts(user.id));
    }
  }, [dispatch, user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning History</h1>
          <p className="text-gray-600">
            Review your past learning sessions and AI-generated lessons.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No learning sessions yet</h3>
            <p className="text-gray-600">
              Start your first learning session from the dashboard.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {prompts.map((prompt) => (
              <div key={prompt.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-500">{formatDate(prompt.createdAt)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-gray-900">Your Question</h3>
                    </div>
                    {/* תיקון כאן: שימוש ב-prompt.prompt במקום prompt.promptText */}
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{prompt.prompt}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="h-5 w-5 text-green-600" />
                      <h3 className="font-medium text-gray-900">AI Response</h3>
                    </div>
                    <div className="prose max-w-none">
                      <div className="bg-green-50 p-4 rounded-lg">
                        {/* תיקון כאן: שימוש ב-prompt.response במקום prompt.responseText */}
                        <p className="text-gray-800 whitespace-pre-wrap">{prompt.response}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default History;