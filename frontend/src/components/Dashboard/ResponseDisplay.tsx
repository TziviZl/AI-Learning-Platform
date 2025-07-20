import React from 'react';
import { MessageSquare } from 'lucide-react';

interface ResponseDisplayProps {
  currentResponse?: string | null;
  lastPromptText?: string | null;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ currentResponse, lastPromptText }) => {
  return (
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
  );
};

export default ResponseDisplay;
