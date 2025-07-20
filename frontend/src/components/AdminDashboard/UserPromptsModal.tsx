import React from 'react';
import { X } from 'lucide-react';

interface Prompt {
  id: number;
  createdAt: string;
  prompt: string;
  response: string;
}

interface User {
  id: number;
  name: string;
}

interface UserPromptsModalProps {
  user: User;
  prompts: Prompt[];
  loading: boolean;
  onClose: () => void;
  formatDate: (dateString?: string) => string;
}

const UserPromptsModal: React.FC<UserPromptsModalProps> = ({ user, prompts, loading, onClose, formatDate }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              User Prompts - {user.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : prompts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No prompts found for this user.</p>
          ) : (
            <div className="space-y-4">
              {prompts.map((prompt) => (
                <div key={prompt.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="text-sm text-gray-500 mb-2">
                    {formatDate(prompt.createdAt)}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <strong className="text-gray-900">Question:</strong>
                      <p className="text-gray-700 text-sm">{prompt.prompt}</p>
                    </div>
                    <div>
                      <strong className="text-gray-900">Response:</strong>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{prompt.response}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPromptsModal;
