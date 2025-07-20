import React from 'react';

interface Props {
  error?: string | null;
}

const ErrorMessage: React.FC<Props> = ({ error }) => {
  if (!error) return null;
  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
      <p className="text-sm text-red-600">{error}</p>
    </div>
  );
};

export default ErrorMessage;
