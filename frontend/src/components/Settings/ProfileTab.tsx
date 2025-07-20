import React from 'react';
import { useFormContext } from 'react-hook-form';

interface Props {
  user?: { name: string; phone: string };
  errors: any;
}

const ProfileTab: React.FC<Props> = ({ user, errors }) => {
  const { register } = useFormContext();

  return (
    <>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          {...register('name', { required: 'Name is required' })}
          type="text"
          defaultValue={user?.name || ''}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          value={user?.phone || ''}
          disabled
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
        />
        <p className="mt-1 text-sm text-gray-500">Phone number cannot be changed</p>
      </div>
    </>
  );
};

export default ProfileTab;
