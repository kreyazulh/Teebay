import React from 'react';

type Step3DescriptionProps = {
  description: string;
  onChange: (description: string) => void;
};

const Step3Description: React.FC<Step3DescriptionProps> = ({ description, onChange }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Write a description</h2>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Product Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          value={description}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe your product in detail..."
          required
        />
        <p className="mt-2 text-sm text-gray-500">
          Include details about condition, features, and anything a buyer should know.
        </p>
      </div>
    </div>
  );
};

export default Step3Description;