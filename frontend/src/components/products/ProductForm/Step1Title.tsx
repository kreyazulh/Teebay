import React from 'react';

type Step1TitleProps = {
  title: string;
  onChange: (title: string) => void;
};

const Step1Title: React.FC<Step1TitleProps> = ({ title, onChange }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Select a title for your product</h2>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Product Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter a descriptive title"
          required
        />
        <p className="mt-2 text-sm text-gray-500">
          A good title should be concise and describe your product clearly.
        </p>
      </div>
    </div>
  );
};

export default Step1Title;