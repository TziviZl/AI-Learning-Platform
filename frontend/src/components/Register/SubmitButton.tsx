import React from 'react';
import { UserPlus } from 'lucide-react';

interface Props {
  loading: boolean;
}

const SubmitButton: React.FC<Props> = ({ loading }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          Sign up
        </>
      )}
    </button>
  );
};

export default SubmitButton;
